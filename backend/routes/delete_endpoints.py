from fastapi import APIRouter, HTTPException, Depends
import os
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import ( 
    Staff, 
    Pacientes, 
    Exercise, 
    CertificationPeriod,
    PacienteExerciseAssignment,
    Documentos)

router = APIRouter()

#///////////////////////// STAFF //////////////////////////#

@router.delete("/staff/{staff_id}", status_code=204)
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff_db = db.query(Staff).filter(Staff.id == staff_id).first()

    if not staff_db:
        raise HTTPException(status_code=404, detail="Staff no encontrado.")

    db.delete(staff_db)
    db.commit()

    return

#///////////////////////// VISITS //////////////////////////#

@router.delete("/visits/{id}")
def delete_visit(id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    has_note = visit.note is not None
    has_signature = visit.note and (
        visit.note.therapist_signature or
        visit.note.patient_signature or
        visit.note.visit_date_signature
    )

    if has_note or has_signature:
        visit.is_hidden = True 
    else:
        db.delete(visit)

    db.commit()
    return {"msg": "Visit removed"}

#////////////////////////// NOTAS //////////////////////////#

@router.delete("/visit-notes/{note_id}")
def delete_visit_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(VisitNote).filter(VisitNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()
    return {"detail": "Visit note deleted"}

@router.delete("/note-sections/{section_id}")
def delete_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(NoteSection).filter(NoteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"detail": "Section deleted"}

#///////////////////////// PATIENTS //////////////////////////#

@router.put("/pacientes/{paciente_id}/deactivate")
def deactivate_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Pacientes).filter(Pacientes.id_paciente == paciente_id).first()

    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    paciente.activo = False

    cert_periods = db.query(CertificationPeriod).filter(
        CertificationPeriod.paciente_id == paciente_id,
        CertificationPeriod.is_active == True
    ).all()

    for cert in cert_periods:
        cert.is_active = False

    db.commit()

    return {
        "message": "Paciente y sus periodos de certificación activos desactivados.",
        "paciente_id": paciente.id_paciente
    }

#///////////////////////// CERT PERIODS //////////////////////////#

@router.delete("/cert-periods/{cert_id}")
def delete_certification_period(cert_id: int, db: Session = Depends(get_db)):
    cert = db.query(CertificationPeriod).filter(CertificationPeriod.id == cert_id).first()

    if not cert:
        raise HTTPException(status_code=404, detail="Certification period not found.")

    if cert.visits:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete certification period with existing visits."
        )

    db.delete(cert)
    db.commit()
    return {"detail": "Certification period deleted successfully."}

#///////////////////////// DOCUMENTOS //////////////////////////#

@router.delete("/documentos/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Documentos).filter(Documentos.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado.")

    if doc.ruta_archivo and os.path.isfile(doc.ruta_archivo):
        try:
            os.remove(doc.ruta_archivo)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"No se pudo eliminar el archivo físico: {str(e)}"
            )

    db.delete(doc)
    db.commit()

    return {"detail": "Documento eliminado correctamente."}

#///////////////////////// EXERCISES //////////////////////////#

@router.delete("/exercises/{exercise_id}")
def deactivate_or_delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found.")

    assigned = db.query(PacienteExerciseAssignment).filter(
        PacienteExerciseAssignment.exercise_id == exercise_id
    ).first()

    if assigned:
        exercise.is_active = False
        db.commit()
        return {"detail": "Exercise desactivado porque está asignado a pacientes."}
    else:
        db.delete(exercise)
        db.commit()
        return {"detail": "Exercise eliminado completamente (no estaba asignado)."}

@router.delete("/assigned-exercises/{assignment_id}")
def delete_assigned_exercise(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(PacienteExerciseAssignment).filter(PacienteExerciseAssignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Exercise assignment not found.")

    db.delete(assignment)
    db.commit()
    return {"detail": "Exercise assignment deleted successfully."}