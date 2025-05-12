from fastapi import APIRouter, HTTPException, Depends, Query
import os, shutil
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from database.connection import get_db
from database.models import (
    Staff, 
    Pacientes, 
    Exercise, 
    PacienteExerciseAssignment, 
    Visit, 
    StaffAssignment,
    CertificationPeriod,
    Documentos)
from schemas import (
    StaffResponse,
    PacienteResponse,
    ExerciseResponse,
    PacienteExerciseAssignmentResponse,
    VisitResponse,
    VisitNoteResponse,
    NoteTemplateResponse,
    NoteSectionResponse,
    CertificationPeriodResponse,
    StaffAssignmentResponse,
    DocumentoResponse)

router = APIRouter()

#////////////////////////// STAFF //////////////////////////#

@router.get("/staff/", response_model=List[StaffResponse])
def get_active_staff(db: Session = Depends(get_db)):
    staff_list = db.query(Staff).filter(Staff.activo == True).all()
    return staff_list

@router.get("/paciente/{paciente_id}/assigned-staff", response_model=List[StaffAssignmentResponse])
def get_assigned_staff(paciente_id: int, db: Session = Depends(get_db)):
    assignments = db.query(StaffAssignment).filter(StaffAssignment.paciente_id == paciente_id).all()
    
    return [
        StaffAssignmentResponse(
            id=a.id,
            fecha_asignacion=a.fecha_asignacion,
            rol_asignado=a.rol_asignado,
            staff=StaffResponse(
                id=a.staff.id,
                name=a.staff.name,
                email=a.staff.email,
                rol=a.staff.rol
            )
        )
        for a in assignments
    ]

#////////////////////////// PACIENTES //////////////////////////#

@router.get("/pacientes/", response_model=List[PacienteResponse])
def get_active_pacientes(db: Session = Depends(get_db)):
    pacientes_list = db.query(Pacientes).filter(Pacientes.activo == True).all()
    return pacientes_list

@router.get("/staff/{staff_id}/assigned-patients", response_model=List[PacienteResponse])
def get_assigned_patients(staff_id: int, db: Session = Depends(get_db)):
    assignments = db.query(StaffAssignment).filter(StaffAssignment.staff_id == staff_id).all()
    pacientes = [a.paciente for a in assignments if a.paciente.activo]
    return pacientes

#////////////////////////// EJERCICIOS DISPONIBLES //////////////////////////#

@router.get("/exercises/", response_model=List[ExerciseResponse])
def get_exercises(discipline: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Exercise)
    if discipline:
        query = query.filter(Exercise.discipline == discipline)
    exercises = query.all()
    return exercises

@router.get("/pacientes/{paciente_id}/exercises/", response_model=List[PacienteExerciseAssignmentResponse])
def get_exercises_of_paciente(paciente_id: int, db: Session = Depends(get_db)):
    assignments = db.query(PacienteExerciseAssignment).filter(PacienteExerciseAssignment.paciente_id == paciente_id).all()
    return assignments

#////////////////////////// VISITS //////////////////////////#

@router.get("/visits/certperiod/{cert_id}", response_model=List[VisitResponse])
def get_visits_by_certification_period(cert_id: int, db: Session = Depends(get_db)):
    visits = db.query(Visit).filter(
        Visit.certification_period_id == cert_id,
        Visit.is_hidden == False
    ).all()
    return visits

@router.get("/visits/certperiod/{cert_id}/deleted", response_model=List[VisitResponse])
def get_deleted_visits(cert_id: int, db: Session = Depends(get_db)):
    visits = db.query(Visit).filter(
        Visit.certification_period_id == cert_id,
        Visit.is_hidden == True
    ).all()
    return visits

#////////////////////////// NOTAS //////////////////////////#

@router.get("/visit-notes/{visit_id}", response_model=VisitNoteResponse)
def get_visit_note_by_visit(visit_id: int, db: Session = Depends(get_db)):
    note = db.query(VisitNote).filter(VisitNote.visit_id == visit_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.get("/note-sections/{note_id}", response_model=List[NoteSectionResponse])
def get_sections(note_id: int, db: Session = Depends(get_db)):
    return db.query(NoteSection).filter(NoteSection.note_id == note_id).all()

@router.get("/note-templates/active", response_model=List[NoteTemplateResponse])
def get_active_template_sections(discipline: str, note_type: str, db: Session = Depends(get_db)):
    return db.query(NoteTemplate).filter(
        NoteTemplate.discipline == discipline,
        NoteTemplate.note_type == note_type,
        NoteTemplate.is_active == True
    ).all()

#////////////////////////// DOCUMENTOS //////////////////////////#

@router.get("/documentos/", response_model=List[DocumentoResponse])
def get_documents_by_entity(
    paciente_id: Optional[int] = Query(None),
    staff_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    if paciente_id and staff_id:
        raise HTTPException(status_code=400, detail="Proporcione solo paciente_id o staff_id, no ambos.")

    if not paciente_id and not staff_id:
        raise HTTPException(status_code=400, detail="Debe proporcionar paciente_id o staff_id.")

    if paciente_id:
        return db.query(Documentos).filter(Documentos.paciente_id == paciente_id).all()

    return db.query(Documentos).filter(Documentos.staff_id == staff_id).all()

@router.get("/documentos/{doc_id}/preview")
def preview_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Documentos).filter(Documentos.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    if not os.path.isfile(doc.ruta_archivo):
        raise HTTPException(status_code=404, detail="Archivo físico no encontrado")

    return FileResponse(
        path=doc.ruta_archivo,
        media_type="application/pdf",
        filename=doc.file_name,
        headers={"Content-Disposition": f'inline; filename="{doc.file_name}"'}
    )

#////////////////////////// CERT PERIODS //////////////////////////#

@router.get("/paciente/{paciente_id}/cert-periods", response_model=List[CertificationPeriodResponse])
def get_cert_periods_by_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(CertificationPeriod).filter(CertificationPeriod.paciente_id == paciente_id).order_by(CertificationPeriod.start_date.desc()).all()