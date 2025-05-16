from fastapi import APIRouter, HTTPException, Depends, Body, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import date, datetime, timedelta
from database.connection import get_db
from database.models import (
    Staff, 
    Patient, 
    CertificationPeriod, 
    Exercise, 
    NoteSection, NoteTemplate, NoteTemplateSection,
    Visit, VisitNote)
from schemas import (
    VisitCreate, VisitResponse, VisitUpdate,
    CertificationPeriodUpdate, CertificationPeriodResponse,
    ExerciseResponse,
    NoteSectionResponse, NoteSectionUpdate,
    NoteTemplateUpdate, NoteTemplateResponse,
    VisitNoteResponse, VisitNoteUpdate)
from auth.security import hash_password

router = APIRouter()

#////////////////////////// STAFF //////////////////////////#

@router.put("/staff/{staff_id}")
def update_staff_info(
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
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found.")

    if email:
        existing_email = db.query(Staff).filter(Staff.email == email, Staff.id != staff_id).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered.")

    if username:
        existing_username = db.query(Staff).filter(Staff.username == username, Staff.id != staff_id).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already registered.")

    update_data = {
        "name": name,
        "birthday": birthday,
        "gender": gender,
        "postal_code": postal_code,
        "email": email,
        "phone": phone,
        "alt_phone": alt_phone,
        "username": username,
        "role": role,
        "is_active": is_active
    }

    for key, value in update_data.items():
        if value is not None:
            setattr(staff, key, value)

    if password is not None:
    if password.strip() == "":
        raise HTTPException(status_code=400, detail="Password cannot be empty.")
    staff.password = hash_password(password)

    db.commit()
    db.refresh(staff)

    return {"message": "Staff updated successfully.", "staff_id": staff.id}

#////////////////////////// PACIENTES //////////////////////////#

@router.put("/patients/{patient_id}")
def update_patient_info(
    patient_id: int,
    full_name: Optional[str] = None,
    birthday: Optional[str] = None,
    gender: Optional[str] = None,
    address: Optional[str] = None,
    contact_info: Optional[str] = None,
    payor_type: Optional[str] = None,
    physician: Optional[str] = None,
    agency_id: Optional[int] = None,
    nursing_diagnosis: Optional[str] = None,
    urgency_level: Optional[str] = None,
    prior_level_of_function: Optional[str] = None,
    homebound_status: Optional[str] = None,
    weight_bearing_status: Optional[str] = None,
    referral_reason: Optional[str] = None,
    weight: Optional[str] = None,
    height: Optional[str] = None,
    past_medical_history: Optional[str] = None,
    clinical_grouping: Optional[str] = None,
    required_disciplines: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    update_data = {
        k: v for k, v in {
            "full_name": full_name,
            "birthday": birthday,
            "gender": gender,
            "address": address,
            "contact_info": contact_info,
            "payor_type": payor_type,
            "physician": physician,
            "agency_id": agency_id,
            "nursing_diagnosis": nursing_diagnosis,
            "urgency_level": urgency_level,
            "prior_level_of_function": prior_level_of_function,
            "homebound_status": homebound_status,
            "weight_bearing_status": weight_bearing_status,
            "referral_reason": referral_reason,
            "weight": weight,
            "height": height,
            "past_medical_history": past_medical_history,
            "clinical_grouping": clinical_grouping,
            "required_disciplines": required_disciplines,
            "is_active": is_active
        }.items() if v is not None
    }

    for key, value in update_data.items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return {"message": "Patient updated successfully.", "patient_id": patient.id}

@router.put("/patients/{patient_id}/activate")
def activate_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    patient.is_active = True
    today = datetime.utcnow().date()

    cert_periods = db.query(CertificationPeriod).filter(CertificationPeriod.patient_id == patient_id).all()

    found_valid = False

    for cert in cert_periods:
        if cert.start_date <= today <= cert.end_date:
            cert.is_active = True
            found_valid = True
        else:
            cert.is_active = False 

    db.commit()
    return {
        "message": "Patient reactivated successfully.",
        "patient_id": patient_id,
        "valid_cert_found": found_valid
    }

#////////////////////////// VISITS //////////////////////////#

@router.put("/visits/{id}", response_model=VisitResponse)
def update_visit(
    id: int,
    patient_id: Optional[int] = Query(None),
    staff_id: Optional[int] = Query(None),
    certification_period_id: Optional[int] = Query(None),
    visit_date: Optional[date] = Query(None),
    visit_type: Optional[str] = Query(None),
    therapy_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    scheduled_time: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    original_visit_type = visit.visit_type

    update_fields = {
        "patient_id": patient_id,
        "staff_id": staff_id,
        "certification_period_id": certification_period_id,
        "visit_date": visit_date,
        "visit_type": visit_type,
        "therapy_type": therapy_type,
        "status": status,
        "scheduled_time": scheduled_time,
    }

    for field, value in update_fields.items():
        if value is not None:
            setattr(visit, field, value)

    db.commit()
    db.refresh(visit)

    if visit_type and visit_type != original_visit_type:
        existing_note = visit.note

        if existing_note:
            is_note_empty = (
                not existing_note.therapist_signature and
                not existing_note.patient_signature and
                not existing_note.visit_date_signature and
                not any(
                    s.get("content") for s in (existing_note.sections_data or [])
                    if isinstance(s, dict)
                )
            )

            if is_note_empty:
                existing_note.note_type = visit_type
                db.commit()
                db.refresh(existing_note)
            else:
                matching_template = db.query(NoteTemplate).filter_by(
                    discipline=visit.staff.rol,
                    note_type=visit_type,
                    is_active=True
                ).first()

                if not matching_template:
                    raise HTTPException(status_code=404, detail="No matching template found")

                template_sections = db.query(NoteTemplateSection)\
                    .filter(NoteTemplateSection.template_id == matching_template.id)\
                    .order_by(NoteTemplateSection.position.asc()).all()

                sections_data = [{"section_id": s.section_id, "content": {}} for s in template_sections]

                new_note = VisitNote(
                    visit_id=visit.id,
                    discipline=visit.staff.rol,
                    note_type=visit_type,
                    sections_data=sections_data
                )
                db.add(new_note)
                db.commit()
                db.refresh(new_note)

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
def update_section(section_id: int, data: NoteSectionUpdate, db: Session = Depends(get_db)):
    section = db.query(NoteSection).filter(NoteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(section, field, value)

    db.commit()
    db.refresh(section)
    return section

@router.put("/note-templates/{template_id}", response_model=NoteTemplateResponse)
def update_template(
    template_id: int,
    discipline: Optional[str] = Query(None),
    note_type: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    replace_section_ids: Optional[List[int]] = Query(None),
    add_section_ids: Optional[List[int]] = Query(None),
    remove_section_ids: Optional[List[int]] = Query(None),
    db: Session = Depends(get_db)
):
    template = db.query(NoteTemplate).filter_by(id=template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found.")

    if discipline is not None:
        template.discipline = discipline
    if note_type is not None:
        template.note_type = note_type
    if is_active is not None:
        template.is_active = is_active

    if replace_section_ids is not None:
        db.query(NoteTemplateSection).filter_by(template_id=template.id).delete()
        for i, sid in enumerate(replace_section_ids):
            db.add(NoteTemplateSection(template_id=template.id, section_id=sid, position=i))

    if add_section_ids is not None:
        existing_ids = {s.section_id for s in template.sections}
        current_max = len(template.sections)
        for i, sid in enumerate(add_section_ids):
            if sid not in existing_ids:
                db.add(NoteTemplateSection(template_id=template.id, section_id=sid, position=current_max + i))

    if remove_section_ids is not None:
        db.query(NoteTemplateSection).filter(
            NoteTemplateSection.template_id == template.id,
            NoteTemplateSection.section_id.in_(remove_section_ids)
        ).delete(synchronize_session=False)

    db.commit()
    db.refresh(template)
    return template

@router.put("/visit-notes/{note_id}", response_model=VisitNoteResponse)
def update_visit_note(note_id: int, data: VisitNoteUpdate, db: Session = Depends(get_db)):
    note = db.query(VisitNote).filter(VisitNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Visit note not found")

    # Update primitive fields
    if data.status is not None:
        note.status = data.status
    if data.therapist_signature is not None:
        note.therapist_signature = data.therapist_signature
    if data.patient_signature is not None:
        note.patient_signature = data.patient_signature
    if data.visit_date_signature is not None:
        if isinstance(data.visit_date_signature, str):
            try:
                note.visit_date_signature = date.fromisoformat(data.visit_date_signature)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
        else:
            note.visit_date_signature = data.visit_date_signature

    # Update sections_data content
    if data.updated_sections:
        existing = note.sections_data or []
        section_map = {s["section_id"]: s for s in existing}

        for update in data.updated_sections:
            section_map[update.section_id] = {
                "section_id": update.section_id,
                "content": update.content
            }

        note.sections_data = list(section_map.values())

    db.commit()
    db.refresh(note)

    # Return optional template_sections for frontend context
    template = db.query(NoteTemplate).filter_by(
        discipline=note.discipline,
        note_type=note.note_type,
        is_active=True
    ).first()

    template_sections = []
    if template:
        links = (
            db.query(NoteTemplateSection)
            .filter(NoteTemplateSection.template_id == template.id)
            .join(NoteSection)
            .order_by(NoteTemplateSection.position.asc())
            .all()
        )
        template_sections = [ts.section for ts in links]

    return {
        **note.__dict__,
        "template_sections": template_sections
    }


#////////////////////////// CERT PERIOD //////////////////////////#

@router.put("/cert-periods/{cert_id}", response_model=CertificationPeriodResponse)
def update_certification_period(cert_id: int, cert_update: CertificationPeriodUpdate, db: Session = Depends(get_db)):
    cert = (
        db.query(CertificationPeriod)
        .options(joinedload(CertificationPeriod.patient))
        .filter(CertificationPeriod.id == cert_id)
        .first()
    )

    if not cert:
        raise HTTPException(status_code=404, detail="Certification period not found.")

    if not cert.patient:
        cert.patient = db.query(Patient).filter(Patient.id == cert.patient_id).first()

    update_data = cert_update.dict(exclude_unset=True)

    if "start_date" in update_data:
        cert.start_date = update_data["start_date"]

    if "end_date" in update_data:
        cert.end_date = update_data["end_date"]
    elif "start_date" in update_data:
        cert.end_date = cert.start_date + timedelta(days=60)

    today = date.today()
    patient_active = cert.patient.is_active if cert.patient else False
    cert.is_active = patient_active and (cert.start_date <= today <= cert.end_date)

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

    if name is not None: exercise.name = name
    if description is not None: exercise.description = description
    if image_url is not None: exercise.image_url = image_url
    if default_sets is not None: exercise.default_sets = default_sets
    if default_reps is not None: exercise.default_reps = default_reps
    if default_sessions_per_day is not None: exercise.default_sessions_per_day = default_sessions_per_day
    if hep_required is not None: exercise.hep_required = hep_required
    if discipline is not None: exercise.discipline = discipline
    if focus_area is not None: exercise.focus_area = focus_area

    db.commit()
    db.refresh(exercise)
    return exercise