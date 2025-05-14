from fastapi import APIRouter, HTTPException, Depends, Query
import os, json
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from database.connection import get_db
from database.models import (
    Staff, StaffAssignment,
    Patient, 
    Exercise, PatientExerciseAssignment, 
    Visit, VisitNote,
    CertificationPeriod,
    Document,
    NoteSection, NoteTemplate, NoteTemplateSection)
from schemas import (
    StaffResponse, StaffAssignmentResponse,
    PatientResponse,
    ExerciseResponse, PatientExerciseAssignmentResponse,
    VisitResponse,
    VisitNoteResponse,
    NoteSectionResponse,
    CertificationPeriodResponse,
    DocumentResponse,
    NoteTemplateWithSectionsResponse)

router = APIRouter()

#====================== STAFF ======================#

@router.get("/staff/", response_model=List[StaffResponse])
def get_active_staff(db: Session = Depends(get_db)):
    return db.query(Staff).filter(Staff.is_active == True).all()

@router.get("/patient/{patient_id}/assigned-staff", response_model=List[StaffAssignmentResponse])
def get_assigned_staff(patient_id: int, db: Session = Depends(get_db)):
    assignments = db.query(StaffAssignment).filter(StaffAssignment.patient_id == patient_id).all()
    
    return [
        StaffAssignmentResponse(
            id=a.id,
            assigned_at=a.assigned_at,
            assigned_role=a.assigned_role,
            staff=StaffResponse(
                id=a.staff.id,
                name=a.staff.name,
                email=a.staff.email,
                role=a.staff.role
            )
        )
        for a in assignments
    ]

#====================== PATIENTS ======================#

@router.get("/patients/", response_model=List[PatientResponse])
def get_active_patients(db: Session = Depends(get_db)):
    return db.query(Patient).filter(Patient.is_active == True).all()

@router.get("/staff/{staff_id}/assigned-patients", response_model=List[PatientResponse])
def get_assigned_patients(staff_id: int, db: Session = Depends(get_db)):
    assignments = db.query(StaffAssignment).filter(StaffAssignment.staff_id == staff_id).all()
    patients = [a.patient for a in assignments if a.patient.is_active]
    return patients

#====================== EXERCISES ======================#

@router.get("/exercises/", response_model=List[ExerciseResponse])
def get_exercises(discipline: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Exercise)
    if discipline:
        query = query.filter(Exercise.discipline == discipline)
    return query.all()

@router.get("/patients/{patient_id}/exercises/", response_model=List[PatientExerciseAssignmentResponse])
def get_exercises_of_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(PatientExerciseAssignment).filter(PatientExerciseAssignment.patient_id == patient_id).all()

#====================== VISITS ======================#

@router.get("/visits/certperiod/{cert_id}", response_model=List[VisitResponse])
def get_visits_by_certification_period(cert_id: int, db: Session = Depends(get_db)):
    return db.query(Visit).filter(
        Visit.certification_period_id == cert_id,
        Visit.is_hidden == False
    ).all()

@router.get("/visits/certperiod/{cert_id}/deleted", response_model=List[VisitResponse])
def get_deleted_visits(cert_id: int, db: Session = Depends(get_db)):
    return db.query(Visit).filter(
        Visit.certification_period_id == cert_id,
        Visit.is_hidden == True
    ).all()

#====================== VISIT NOTES ======================#

@router.get("/visit-notes/{visit_id}/debug", response_model=VisitNoteResponse)
def get_note_debug(visit_id: int, db: Session = Depends(get_db)):
    note = db.query(VisitNote).filter(VisitNote.visit_id == visit_id).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    print("======= DEBUG INFO FOR NOTE =======")
    print(f"Note ID: {note.id}")
    print(f"Visit ID: {note.visit_id}")
    print(f"Discipline: {note.discipline}")
    print(f"Note Type: {note.note_type}")
    print(f"Status: {note.status}")
    print(f"Therapist Signature: {note.therapist_signature}")
    print(f"Patient Signature: {note.patient_signature}")
    print(f"Visit Date Signature: {note.visit_date_signature}")
    print("Sections Data Raw:", note.sections_data)
    print("Sections Data JSON Dump:", json.dumps(note.sections_data, indent=2) if note.sections_data else "None")
    print("======= END DEBUG INFO =======")

    return VisitNoteResponse(
        id=note.id,
        visit_id=note.visit_id,
        status=note.status,
        discipline=note.discipline,
        note_type=note.note_type,
        therapist_signature=note.therapist_signature,
        patient_signature=note.patient_signature,
        visit_date_signature=note.visit_date_signature,
        sections_data=note.sections_data or [],
        template_sections=[],
    )

@router.get("/note-sections", response_model=List[NoteSectionResponse])
def get_all_sections(db: Session = Depends(get_db)):
    return db.query(NoteSection).all()

@router.get("/note-templates/full", response_model=List[NoteTemplateWithSectionsResponse])
def get_all_templates_with_sections(db: Session = Depends(get_db)):
    templates = db.query(NoteTemplate).options(
        joinedload(NoteTemplate.sections).joinedload(NoteTemplateSection.section)
    ).filter(NoteTemplate.is_active == True).all()

    result = []
    for template in templates:
        ordered_sections = sorted(template.sections, key=lambda s: s.position or 0)
        note_sections = [ts.section for ts in ordered_sections]

        result.append(NoteTemplateWithSectionsResponse(
            id=template.id,
            discipline=template.discipline,
            note_type=template.note_type,
            is_active=template.is_active,
            sections=note_sections
        ))

    return result

#====================== DOCUMENTS ======================#

@router.get("/documents/", response_model=List[DocumentResponse])
def get_documents_by_entity(
    patient_id: Optional[int] = Query(None),
    staff_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    if patient_id and staff_id:
        raise HTTPException(status_code=400, detail="Provide only patient_id or staff_id, not both.")
    if not patient_id and not staff_id:
        raise HTTPException(status_code=400, detail="You must specify either patient_id or staff_id.")

    if patient_id:
        return db.query(Document).filter(Document.patient_id == patient_id).all()

    return db.query(Document).filter(Document.staff_id == staff_id).all()

@router.get("/documents/{doc_id}/preview")
def preview_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.isfile(doc.file_path):
        raise HTTPException(status_code=404, detail="Physical file not found")

    return FileResponse(
        path=doc.file_path,
        media_type="application/pdf",
        filename=doc.file_name,
        headers={"Content-Disposition": f'inline; filename="{doc.file_name}"'}
    )

#====================== CERTIFICATION PERIODS ======================#

@router.get("/patient/{patient_id}/cert-periods", response_model=List[CertificationPeriodResponse])
def get_cert_periods_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(CertificationPeriod).filter(
        CertificationPeriod.patient_id == patient_id
    ).order_by(CertificationPeriod.start_date.desc()).all()