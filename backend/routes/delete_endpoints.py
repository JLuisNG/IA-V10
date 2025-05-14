from fastapi import APIRouter, HTTPException, Depends
import os
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import ( 
    Staff, 
    Patient, 
    Exercise, 
    CertificationPeriod,
    PatientExerciseAssignment,
    Document,
    NoteSection,
    Visit,
    VisitNote)

router = APIRouter()

#///////////////////////// STAFF //////////////////////////#

@router.delete("/staff/{staff_id}", status_code=204)
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found.")
    db.delete(staff)
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

    visit = note.visit

    has_signatures = any([
        note.therapist_signature,
        note.patient_signature,
        note.visit_date_signature
    ])
    has_content = any(
        section.get("content") for section in (note.sections_data or [])
        if isinstance(section.get("content"), dict) and section["content"]
    )

    if not has_signatures and not has_content:
        db.delete(note)
        if visit:
            db.delete(visit)
        db.commit()
        return {"detail": "Visit note and visit deleted (empty note)"}
    else:
        if visit:
            visit.is_hidden = True
            db.commit()
        return {"detail": "Visit contains information. Visit was hidden instead of deleted."}

@router.delete("/note-sections/{section_id}")
def delete_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(NoteSection).filter(NoteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"detail": "Section deleted"}

#///////////////////////// PATIENTS //////////////////////////#

@router.put("/patients/{patient_id}/deactivate")
def deactivate_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    patient.is_active = False

    cert_periods = db.query(CertificationPeriod).filter(
        CertificationPeriod.patient_id == patient_id,
        CertificationPeriod.is_active == True
    ).all()

    for cert in cert_periods:
        cert.is_active = False

    db.commit()

    return {
        "message": "Patient and their active certification periods deactivated.",
        "patient_id": patient.id
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

@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if doc.file_path and os.path.isfile(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete physical file: {str(e)}"
            )

    db.delete(doc)
    db.commit()
    return {"detail": "Document deleted successfully."}

#///////////////////////// EXERCISES //////////////////////////#

@router.delete("/exercises/{exercise_id}")
def deactivate_or_delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found.")

    assigned = db.query(PatientExerciseAssignment).filter(
        PatientExerciseAssignment.exercise_id == exercise_id
    ).first()

    if assigned:
        exercise.is_active = False
        db.commit()
        return {"detail": "Exercise deactivated because it is assigned to patients."}
    else:
        db.delete(exercise)
        db.commit()
        return {"detail": "Exercise permanently deleted (not assigned)."}

@router.delete("/assigned-exercises/{assignment_id}")
def delete_assigned_exercise(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(PatientExerciseAssignment).filter(
        PatientExerciseAssignment.id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Exercise assignment not found.")

    db.delete(assignment)
    db.commit()
    return {"detail": "Exercise assignment deleted successfully."}
    assignment = db.query(PatientExerciseAssignment).filter(PatientExerciseAssignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Exercise assignment not found.")

    db.delete(assignment)
    db.commit()
    return {"detail": "Exercise assignment deleted successfully."}