from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import Staff, Pacientes, Exercise, CertificationPeriod

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

#///////////////////////// EJERCICIOS //////////////////////////#

@router.delete("/exercises/{exercise_id}", status_code=204)
def delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise_db = db.query(Exercise).filter(Exercise.id == exercise_id).first()

    if not exercise_db:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")

    db.delete(exercise_db)
    db.commit()

    return

#///////////////////////// VISITS //////////////////////////#

@router.delete("/visits/{id}")
def delete_visit(id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(404, "Visit not found")
    db.delete(visit)
    db.commit()
    return {"msg": "Deleted"}

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