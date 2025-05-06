from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from database.connection import get_db
from database.models import Staff, Pacientes, Exercise, PacienteExerciseAssignment
from schemas import (
    StaffResponse,
    PacienteResponse,
    ExerciseResponse,
    PacienteExerciseAssignmentResponse
)

router = APIRouter()

#////////////////////////// STAFF //////////////////////////#

@router.get("/staff/", response_model=List[StaffResponse])
def get_active_staff(db: Session = Depends(get_db)):
    staff_list = db.query(Staff).filter(Staff.activo == True).all()
    return staff_list

#////////////////////////// PACIENTES //////////////////////////#

@router.get("/pacientes/", response_model=List[PacienteResponse])
def get_active_pacientes(db: Session = Depends(get_db)):
    pacientes_list = db.query(Pacientes).filter(Pacientes.activo == True).all()
    return pacientes_list

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

@router.get("/visits/patient/{id_paciente}")
def get_visits_by_patient(id_paciente: int, db: Session = Depends(get_db)):
    return db.query(Visit).filter(Visit.paciente_id == id_paciente).all()