from fastapi import APIRouter, HTTPException, Depends
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
    CertificationPeriod)
from schemas import (
    StaffResponse,
    PacienteResponse,
    ExerciseResponse,
    PacienteExerciseAssignmentResponse,
    VisitResponse,
    CertificationPeriodResponse
)

router = APIRouter()

#////////////////////////// STAFF //////////////////////////#

@router.get("/staff/", response_model=List[StaffResponse])
def get_active_staff(db: Session = Depends(get_db)):
    staff_list = db.query(Staff).filter(Staff.activo == True).all()
    return staff_list

@router.get("/paciente/{paciente_id}/assigned-staff", response_model=List[dict])
def get_assigned_staff(paciente_id: int, db: Session = Depends(get_db)):
    assignments = db.query(StaffAssignment).filter(StaffAssignment.paciente_id == paciente_id).all()
    
    return [
        {
            "staff": {
                "id": a.staff.id,
                "name": a.staff.name,
                "email": a.staff.email,
                "rol": a.staff.rol
            },
            "rol_asignado": a.rol_asignado
        }
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
    visits = db.query(Visit).filter(Visit.certification_period_id == cert_id).all()
    return visits

#////////////////////////// CERT PERIODS //////////////////////////#

@router.get("/paciente/{paciente_id}/cert-periods", response_model=List[CertificationPeriodResponse])
def get_cert_periods_by_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(CertificationPeriod).filter(CertificationPeriod.paciente_id == paciente_id).order_by(CertificationPeriod.start_date.desc()).all()