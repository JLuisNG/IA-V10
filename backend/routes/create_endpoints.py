import os, shutil, re
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta, date
from database.connection import get_db
from database.models import (
    Staff, StaffAssignment, 
    Patient, 
    CertificationPeriod, 
    Document, 
    PatientExerciseAssignment, Exercise,
    Visit,
    NoteSection, VisitNote,
    NoteTemplate, NoteTemplateSection)
from schemas import (
    StaffCreate, StaffResponse, StaffAssignmentResponse,
    PatientCreate, PatientResponse,
    DocumentResponse, 
    ExerciseCreate, ExerciseResponse, PatientExerciseAssignmentCreate, 
    VisitCreate, VisitResponse,
    VisitNoteResponse,
    NoteSectionCreate, NoteSectionResponse,
    NoteTemplateCreate, NoteTemplateResponse)
from auth.security import hash_password
from auth.auth_middleware import role_required, get_current_user

router = APIRouter()

BASE_STORAGE_PATH = "/app/storage/docs"

#====================== STAFF ======================#

@router.post("/staff/", response_model=StaffResponse)
def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    existing_email = db.query(Staff).filter(Staff.email == staff.email).first()
    existing_username = db.query(Staff).filter(Staff.username == staff.username).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered.")
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    hashed_password = hash_password(staff.password)#

    staff_data = staff.dict()
    staff_data["password"] = hashed_password

    new_staff = Staff(**staff_data)
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff

@router.post("/assign-staff", response_model=StaffAssignmentResponse)
def assign_staff_to_patient(patient_id: int, staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found.")

    assigned_role = staff.role
    existing_assignment = db.query(StaffAssignment).filter(
        StaffAssignment.patient_id == patient_id,
        StaffAssignment.assigned_role == assigned_role
    ).first()

    if existing_assignment and existing_assignment.staff_id == staff_id:
        return existing_assignment

    if existing_assignment:
        existing_assignment.staff_id = staff_id
        existing_assignment.assigned_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_assignment)
        return existing_assignment

    new_assignment = StaffAssignment(
        patient_id=patient_id,
        staff_id=staff_id,
        assigned_role=assigned_role,
        assigned_at=datetime.utcnow()
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

#====================== PATIENTS ======================#

@router.post("/patients/", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(
        Patient.full_name == patient.full_name,
        Patient.birthday == patient.birthday
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient already registered.")

    agency = db.query(Staff).filter(Staff.id == patient.agency_id).first()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency does not exist.")
    if agency.role.lower() != "agency":
        raise HTTPException(status_code=400, detail="Provided ID does not belong to a valid agency.")

    new_patient = Patient(**patient.dict(exclude={"initial_cert_start_date"}))
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    cert_start = patient.initial_cert_start_date
    cert_end = cert_start + timedelta(days=60)

    cert_period = CertificationPeriod(
        patient_id=new_patient.id,
        start_date=cert_start,
        end_date=cert_end,
        is_active=True
    )
    db.add(cert_period)
    db.commit()

    return PatientResponse.model_validate(new_patient)

#====================== DOCUMENTS ======================#

def sanitize_filename(filename: str) -> str:
    name, ext = os.path.splitext(filename)
    name = re.sub(r'[^\w\d-]', '_', name)  
    return f"{name}{ext.lower()}"

@router.post("/documents/upload", response_model=DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    patient_id: int = Form(None),
    staff_id: int = Form(None),
    db: Session = Depends(get_db)
):
    if patient_id and staff_id:
        raise HTTPException(status_code=400, detail="Provide only patient_id or staff_id, not both.")
    if not patient_id and not staff_id:
        raise HTTPException(status_code=400, detail="You must specify either patient_id or staff_id.")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    clean_name = sanitize_filename(file.filename)
    entity = "patients" if patient_id else "staff"
    entity_id = patient_id or staff_id
    folder_path = os.path.join(BASE_STORAGE_PATH, entity, str(entity_id))
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, clean_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_doc = Document(
        patient_id=patient_id,
        staff_id=staff_id,
        file_name=clean_name,
        file_path=file_path,
        uploaded_at=datetime.utcnow()
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

#====================== EXERCISES ======================#

@router.post("/exercises/", response_model=ExerciseResponse)
def create_exercise(exercise: ExerciseCreate, db: Session = Depends(get_db)):
    new_exercise = Exercise(**exercise.dict())
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return new_exercise

@router.post("/patients/exercises/")
def assign_exercises_to_patient(assignments: List[PatientExerciseAssignmentCreate], db: Session = Depends(get_db)):
    for a in assignments:
        db.add(PatientExerciseAssignment(**a.dict()))
    db.commit()
    return {"message": "Exercises assigned successfully."}

#====================== CERTIFICATION PERIODS ======================#

@router.post("/patients/{patient_id}/certification-period")
def create_certification_period(
    patient_id: int,
    start_date: date,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    end_date = start_date + timedelta(days=60)
    today = date.today()

    is_active = patient.is_active and (start_date <= today <= end_date)

    new_cert = CertificationPeriod(
        patient_id=patient_id,
        start_date=start_date,
        end_date=end_date,
        is_active=is_active
    )

    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return {
        "message": "New certification period created successfully.",
        "certification_period_id": new_cert.id
    }

#====================== VISITS ======================#

@router.post("/visits/assign", response_model=VisitResponse)
def create_visit(data: VisitCreate, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == data.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    cert = db.query(CertificationPeriod).filter(
        CertificationPeriod.patient_id == data.patient_id,
        CertificationPeriod.start_date <= data.visit_date,
        CertificationPeriod.end_date >= data.visit_date
    ).first()
    if not cert:
        raise HTTPException(status_code=404, detail="No certification period found for given date")

    visit = Visit(
        patient_id=data.patient_id,
        staff_id=data.staff_id,
        certification_period_id=cert.id,
        visit_date=data.visit_date,
        visit_type=data.visit_type,
        therapy_type=staff.role.upper(), 
        status=data.status,
        scheduled_time=data.scheduled_time
    )
    db.add(visit)
    db.flush()

    template = db.query(NoteTemplate).filter_by(
        discipline=staff.role.upper(),
        note_type=data.visit_type,
        is_active=True
    ).first()
    if not template:
        raise HTTPException(status_code=404, detail="No active template for this visit type and discipline")

    sections = db.query(NoteTemplateSection).filter(
        NoteTemplateSection.template_id == template.id
    ).order_by(NoteTemplateSection.position.asc()).all()

    sections_data = [{"section_id": s.section_id, "content": {}} for s in sections]

    note = VisitNote(
        visit_id=visit.id,
        discipline=template.discipline,
        note_type=template.note_type,
        status="Scheduled",
        sections_data=sections_data
    )
    db.add(note)
    db.commit()
    db.refresh(visit)
    return visit

#====================== NOTES ======================#

@router.post("/note-templates", response_model=NoteTemplateResponse)
def create_template(template_data: NoteTemplateCreate, db: Session = Depends(get_db)):
    existing = db.query(NoteTemplate).filter_by(
        discipline=template_data.discipline,
        note_type=template_data.note_type
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Template already exists for this discipline and note type.")
        
    new_template = NoteTemplate(
        discipline=template_data.discipline,
        note_type=template_data.note_type,
        is_active=template_data.is_active
    )
    db.add(new_template)
    db.commit()
    db.refresh(new_template)

    for i, section_id in enumerate(template_data.section_ids):
        db.add(NoteTemplateSection(template_id=new_template.id, section_id=section_id, position=i))
    
    db.commit()
    return new_template

@router.post("/note-sections", response_model=NoteSectionResponse)
def create_section(data: NoteSectionCreate, db: Session = Depends(get_db)):
    existing = db.query(NoteSection).filter_by(section_name=data.section_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Section with this name already exists")

    section = NoteSection(**data.dict())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section
