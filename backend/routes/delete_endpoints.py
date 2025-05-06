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

@router.delete("/visits/{id}")
def delete_visit(id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(404, "Visit not found")
    db.delete(visit)
    db.commit()
    return {"msg": "Deleted"}
