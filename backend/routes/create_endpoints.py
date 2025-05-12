import os, shutil, re
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta, date
from database.connection import get_db
from database.models import (
    Staff, 
    Pacientes, 
    CertificationPeriod, 
    Documentos, Exercise, 
    PacienteExerciseAssignment, 
    Visit,
    StaffAssignment, 
    NoteSection,
    VisitNote)
from schemas import (
    StaffCreate, StaffResponse, StaffAssignmentResponse,
    PacienteCreate, PacienteResponse,
    DocumentoCreate, DocumentoResponse, 
    ExerciseCreate, ExerciseResponse, PacienteExerciseAssignmentCreate, 
    VisitCreate, VisitNoteCreate, VisitNoteResponse,
    NoteSectionCreate, NoteSectionResponse,
    NoteTemplateCreate, NoteTemplateResponse)

router = APIRouter()

BASE_STORAGE_PATH = "/app/storage/docs"

#////////////////////////// STAFF //////////////////////////#

@router.post("/staff/", response_model=StaffResponse)
def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    existing_email = db.query(Staff).filter(Staff.email == staff.email).first()
    existing_username = db.query(Staff).filter(Staff.username == staff.username).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email ya registrado.")
    if existing_username:
        raise HTTPException(status_code=400, detail="Username ya registrado.")
    
    new_staff = Staff(
        name=staff.name,
        birthday=staff.birthday,
        gender=staff.gender,
        postal_code=staff.postal_code,
        email=staff.email,
        phone=staff.phone,
        alt_phone=staff.alt_phone,
        username=staff.username,
        password=staff.password,
        rol=staff.rol
    )
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)

    return new_staff

@router.post("/assign-staff", response_model=StaffAssignmentResponse)
def assign_staff_to_patient(paciente_id: int, staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff no encontrado.")

    rol_asignado = staff.rol

    existing_assignment = db.query(StaffAssignment).filter(
        StaffAssignment.paciente_id == paciente_id,
        StaffAssignment.rol_asignado == rol_asignado
    ).first()

    if existing_assignment and existing_assignment.staff_id == staff_id:
        return existing_assignment

    if existing_assignment:
        existing_assignment.staff_id = staff_id
        existing_assignment.fecha_asignacion = datetime.utcnow()
        db.commit()
        db.refresh(existing_assignment)
        return existing_assignment

    new_assignment = StaffAssignment(
        paciente_id=paciente_id,
        staff_id=staff_id,
        rol_asignado=rol_asignado,
        fecha_asignacion=datetime.utcnow()
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

#////////////////////////// PACIENTES //////////////////////////#

@router.post("/pacientes/", response_model=PacienteResponse)
def create_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    existing_paciente = db.query(Pacientes).filter(
        Pacientes.patient_name == paciente.patient_name,
        Pacientes.birthday == paciente.birthday
    ).first()
    if existing_paciente:
        raise HTTPException(status_code=400, detail="Paciente ya registrado.")

    agency = db.query(Staff).filter(Staff.id == paciente.agency_id).first()
    if not agency:
        raise HTTPException(status_code=404, detail="La agencia no existe.")
    if agency.rol.lower() != "agency":
        raise HTTPException(status_code=400, detail="El ID proporcionado no corresponde a una agencia válida.")

    new_paciente = Pacientes(
        patient_name=paciente.patient_name,
        birthday=paciente.birthday,
        gender=paciente.gender,
        address=paciente.address,
        contact_info=paciente.contact_info,
        payor_type=paciente.payor_type,
        physician=paciente.physician,
        agency_id=paciente.agency_id,
        nursing_diagnostic=paciente.nursing_diagnostic,
        urgency_level=paciente.urgency_level,
        prior_level_of_function=paciente.prior_level_of_function,
        homebound=paciente.homebound,
        weight_bearing_status=paciente.weight_bearing_status,
        reason_for_referral=paciente.reason_for_referral,
        weight=paciente.weight,
        height=paciente.height,
        pmh=paciente.pmh,
        clinical_grouping=paciente.clinical_grouping,
        disciplines_needed=paciente.disciplines_needed,
        activo=paciente.activo
    )
    db.add(new_paciente)
    db.commit()
    db.refresh(new_paciente)

    start_date = paciente.initial_cert_start_date
    end_date = start_date + timedelta(days=60)

    cert_period = CertificationPeriod(
        paciente_id=new_paciente.id_paciente,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )
    db.add(cert_period)
    db.commit()

    return PacienteResponse.model_validate(new_paciente)

#////////////////////////// DOCUMENTS //////////////////////////#

def sanitize_filename(filename: str) -> str:
    name, ext = os.path.splitext(filename)
    name = re.sub(r'[^\w\d-]', '_', name)  
    return f"{name}{ext.lower()}"

@router.post("/documentos/upload", response_model=DocumentoResponse)
def upload_document(
    file: UploadFile = File(...),
    paciente_id: int = Form(None),
    staff_id: int = Form(None),
    db: Session = Depends(get_db)
):
    if paciente_id and staff_id:
        raise HTTPException(status_code=400, detail="Solo uno: paciente_id o staff_id.")
    if not paciente_id and not staff_id:
        raise HTTPException(status_code=400, detail="Debe indicar paciente_id o staff_id.")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF.")

    clean_filename = sanitize_filename(file.filename)

    entity = "pacientes" if paciente_id else "staff"
    entity_id = paciente_id or staff_id
    folder_path = os.path.join(BASE_STORAGE_PATH, entity, str(entity_id))
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, clean_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_doc = Documentos(
        paciente_id=paciente_id,
        staff_id=staff_id,
        file_name=clean_filename,
        ruta_archivo=file_path,
        fecha_subida=datetime.utcnow()
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc

#////////////////////////// EJERCICIOS //////////////////////////#

@router.post("/exercises/", response_model=ExerciseResponse)
def create_exercise(exercise: ExerciseCreate, db: Session = Depends(get_db)):
    new_exercise = Exercise(**exercise.dict())
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise

@router.post("/pacientes/exercises/")
def assign_exercises_to_paciente(assignments: List[PacienteExerciseAssignmentCreate], db: Session = Depends(get_db)):
    for assignment in assignments:
        new_assignment = PacienteExerciseAssignment(
            paciente_id=assignment.paciente_id,
            exercise_id=assignment.exercise_id,
            sets=assignment.sets,
            reps=assignment.reps,
            sessions_per_day=assignment.sessions_per_day,
            hep_required=assignment.hep_required,
        )
        db.add(new_assignment)

    db.commit()
    return {"message": "Ejercicios asignados exitosamente."}

#////////////////////////// CERT PERIODS //////////////////////////#

@router.post("/pacientes/{paciente_id}/certification-period")
def create_certification_period(
    paciente_id: int,
    start_date: date,
    db: Session = Depends(get_db)
):
    paciente = db.query(Pacientes).filter(Pacientes.id_paciente == paciente_id).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    end_date = start_date + timedelta(days=60)

    new_cert = CertificationPeriod(
        paciente_id=paciente_id,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )

    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)

    return {
        "message": "Nuevo Certification Period creado exitosamente.",
        "certification_period_id": new_cert.id
    }

#////////////////////////// VISITS //////////////////////////#

@router.post("/visits/assign")
def create_visit(data: VisitCreate, db: Session = Depends(get_db)):
    visit = Visit(**data.dict())
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit

#////////////////////////// NOTAS //////////////////////////#

@router.post("/note-templates", response_model=NoteTemplateResponse)
def create_template_section(template_data: NoteTemplateCreate, db: Session = Depends(get_db)):
    new_section = NoteTemplate(**template_data.dict())
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    return new_section

@router.post("/visit-notes", response_model=VisitNoteResponse)
def create_visit_note(data: VisitNoteCreate, db: Session = Depends(get_db)):
    # Verifica que la visita exista
    visit = db.query(Visit).filter(Visit.id == data.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    # Crea la nota
    new_note = VisitNote(
        visit_id=data.visit_id,
        discipline=data.discipline,
        note_type=data.note_type,
        status=data.status or "In Progress"
    )
    db.add(new_note)
    db.flush()  # para obtener el ID antes de agregar las secciones

    # Busca plantilla por disciplina y tipo
    template_sections = db.query(NoteTemplate).filter(
        NoteTemplate.discipline == data.discipline,
        NoteTemplate.note_type == data.note_type,
        NoteTemplate.is_active == True
    ).all()

    # Crea cada sección basada en plantilla
    for template in template_sections:
        section = NoteSection(
            note_id=new_note.id,
            section_name=template.section_name,
            content=""
        )
        db.add(section)

    db.commit()
    db.refresh(new_note)
    return new_note

@router.post("/note-sections", response_model=NoteSectionResponse)
def create_section(data: NoteSectionCreate, db: Session = Depends(get_db)):
    section = NoteSection(**data.dict())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section
