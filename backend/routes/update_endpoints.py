from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, datetime
from database.connection import get_db
from database.models import Staff, Pacientes, CertificationPeriod, Exercise
from schemas import (
    StaffUpdate, 
    StaffResponse, 
    PacienteUpdate, 
    PacienteResponse, 
    VisitCreate, 
    VisitResponse,
    CertificationPeriodUpdate, 
    CertificationPeriodResponse,
    ExerciseUpdate,
    ExerciseResponse,
    NoteSectionResponse,
    NoteSectionBase,
    NoteTemplateResponse,
    NoteTemplateCreate)

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

@router.put("/visits/{visit_id}/restore", response_model=VisitResponse)
def restore_hidden_visit(visit_id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()

    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found.")

    if not visit.is_hidden:
        raise HTTPException(status_code=400, detail="Visit is already visible.")

    visit.is_hidden = False
    db.commit()
    db.refresh(visit)
    return visit

#////////////////////////// NOTAS //////////////////////////#

@router.put("/note-sections/{section_id}", response_model=NoteSectionResponse)
def update_section(section_id: int, data: NoteSectionBase, db: Session = Depends(get_db)):
    section = db.query(NoteSection).filter(NoteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(section, field, value)

    db.commit()
    db.refresh(section)
    return section

@router.put("/note-templates/{template_id}", response_model=NoteTemplateResponse)
def update_template_section(template_id: int, db: Session = Depends(get_db), data: NoteTemplateCreate = Body(...)):
    template = db.query(NoteTemplate).filter(NoteTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template section not found.")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(template, field, value)

    db.commit()
    db.refresh(template)
    return template

#////////////////////////// CERT PERIOD //////////////////////////#

@router.put("/cert-periods/{cert_id}", response_model=CertificationPeriodResponse)
def update_certification_period(cert_id: int, cert_update: CertificationPeriodUpdate, db: Session = Depends(get_db)):
    cert = db.query(CertificationPeriod).filter(CertificationPeriod.id == cert_id).first()

    if not cert:
        raise HTTPException(status_code=404, detail="Certification period not found.")

    for field, value in cert_update.dict(exclude_unset=True).items():
        setattr(cert, field, value)

    hoy = date.today()
    cert.is_active = cert.paciente.activo and (cert.start_date <= hoy <= cert.end_date)

    db.commit()
    db.refresh(cert)
    return cert

#////////////////////////// EXERCISES //////////////////////////#

@router.put("/exercises/{exercise_id}", response_model=ExerciseResponse)
def update_exercise(
    exercise_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    image_url: Optional[str] = None,
    default_sets: Optional[int] = None,
    default_reps: Optional[int] = None,
    default_sessions_per_day: Optional[int] = None,
    hep_required: Optional[bool] = None,
    discipline: Optional[str] = None,
    focus_area: Optional[str] = None,
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found.")

    # Actualizar solo campos provistos
    if name is not None:
        exercise.name = name
    if description is not None:
        exercise.description = description
    if image_url is not None:
        exercise.image_url = image_url
    if default_sets is not None:
        exercise.default_sets = default_sets
    if default_reps is not None:
        exercise.default_reps = default_reps
    if default_sessions_per_day is not None:
        exercise.default_sessions_per_day = default_sessions_per_day
    if hep_required is not None:
        exercise.hep_required = hep_required
    if discipline is not None:
        exercise.discipline = discipline
    if focus_area is not None:
        exercise.focus_area = focus_area

    db.commit()
    db.refresh(exercise)
    return exercise

