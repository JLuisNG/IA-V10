from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from database.connection import get_db
from database.models import Staff, Pacientes, CertificationPeriod
from schemas import StaffUpdate, StaffResponse, PacienteUpdate, PacienteResponse, VisitCreate

router = APIRouter()

#////////////////////////// STAFF //////////////////////////#

@router.put("/staff/{staff_id}")
def editar_staff_info(
    staff_id: int,
    name: Optional[str] = None,
    birthday: Optional[str] = None, 
    gender: Optional[str] = None,
    postal_code: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    alt_phone: Optional[str] = None,
    username: Optional[str] = None,
    password: Optional[str] = None,
    rol: Optional[str] = None,
    activo: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    staff_db = db.query(Staff).filter(Staff.id == staff_id).first()

    if not staff_db:
        raise HTTPException(status_code=404, detail="Staff no encontrado.")

    if email:
        existing_email = db.query(Staff).filter(Staff.email == email, Staff.id != staff_id).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email ya registrado.")

    if username:
        existing_username = db.query(Staff).filter(Staff.username == username, Staff.id != staff_id).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username ya registrado.")

    update_data = {}
    if name: update_data["name"] = name
    if birthday: update_data["birthday"] = birthday
    if gender: update_data["gender"] = gender
    if postal_code: update_data["postal_code"] = postal_code
    if email: update_data["email"] = email
    if phone: update_data["phone"] = phone
    if alt_phone: update_data["alt_phone"] = alt_phone
    if username: update_data["username"] = username
    if password: update_data["password"] = password
    if rol: update_data["rol"] = rol
    if activo is not None: update_data["activo"] = activo

    for key, value in update_data.items():
        setattr(staff_db, key, value)

    db.commit()
    db.refresh(staff_db)

    return {
        "message": "Staff actualizado correctamente.",
        "staff_id": staff_db.id
    }

#////////////////////////// PACIENTES //////////////////////////#

@router.put("/pacientes/{paciente_id}")
def editar_paciente_info(
    paciente_id: int,
    patient_name: Optional[str] = None,
    birthday: Optional[str] = None,
    gender: Optional[str] = None,
    address: Optional[str] = None,
    contact_info: Optional[str] = None,
    payor_type: Optional[str] = None,
    physician: Optional[str] = None,
    agency_id: Optional[int] = None,
    nursing_diagnostic: Optional[str] = None,
    urgency_level: Optional[str] = None,
    prior_level_of_function: Optional[str] = None,
    homebound: Optional[str] = None,
    weight_bearing_status: Optional[str] = None,
    reason_for_referral: Optional[str] = None,
    weight: Optional[str] = None,
    height: Optional[str] = None,
    pmh: Optional[str] = None,
    clinical_grouping: Optional[str] = None,
    disciplines_needed: Optional[str] = None,
    activo: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    paciente_db = db.query(Pacientes).filter(Pacientes.id_paciente == paciente_id).first()

    if not paciente_db:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    update_data = {}
    if patient_name: update_data["patient_name"] = patient_name
    if birthday: update_data["birthday"] = birthday
    if gender: update_data["gender"] = gender
    if address: update_data["address"] = address
    if contact_info: update_data["contact_info"] = contact_info
    if payor_type: update_data["payor_type"] = payor_type
    if physician: update_data["physician"] = physician
    if agency_id: update_data["agency_id"] = agency_id
    if nursing_diagnostic: update_data["nursing_diagnostic"] = nursing_diagnostic
    if urgency_level: update_data["urgency_level"] = urgency_level
    if prior_level_of_function: update_data["prior_level_of_function"] = prior_level_of_function
    if homebound: update_data["homebound"] = homebound
    if weight_bearing_status: update_data["weight_bearing_status"] = weight_bearing_status
    if reason_for_referral: update_data["reason_for_referral"] = reason_for_referral
    if weight: update_data["weight"] = weight
    if height: update_data["height"] = height
    if pmh: update_data["pmh"] = pmh
    if clinical_grouping: update_data["clinical_grouping"] = clinical_grouping
    if disciplines_needed: update_data["disciplines_needed"] = disciplines_needed
    if activo is not None: update_data["activo"] = activo

    for key, value in update_data.items():
        setattr(paciente_db, key, value)

    db.commit()
    db.refresh(paciente_db)

    return {
        "message": "Paciente actualizado correctamente.",
        "paciente_id": paciente_db.id_paciente
    }

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

@router.put("/pacientes/{paciente_id}/activate")
def activate_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Pacientes).filter(Pacientes.id_paciente == paciente_id).first()
    
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado.")

    paciente.activo = True

    cert_period = db.query(CertificationPeriod)\
        .filter(CertificationPeriod.paciente_id == paciente_id)\
        .order_by(CertificationPeriod.start_date.desc())\
        .first()

    if cert_period:
        today = datetime.utcnow().date()

        if cert_period.start_date <= today <= cert_period.end_date:
            cert_period.is_active = True  
        else:
            pass

    db.commit()

    return {
        "message": "Paciente reactivado correctamente.",
        "paciente_id": paciente_id
    }

#////////////////////////// VISITS //////////////////////////#

@router.put("/visits/{id}")
def update_visit(id: int, data: VisitCreate, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(404, "Visit not found")
    for key, value in data.dict().items():
        setattr(visit, key, value)
    db.commit()
    db.refresh(visit)
    return visit