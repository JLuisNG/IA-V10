from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birthday = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    alt_phone = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    visits = relationship("Visit", back_populates="staff")
    assigned_patients = relationship("StaffAssignment", back_populates="staff")
    documents = relationship("Document", back_populates="staff")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    birthday = Column(Date, nullable=False)
    gender = Column(String, nullable=False)
    address = Column(String, nullable=False)
    contact_info = Column(Text, nullable=True)
    payor_type = Column(String, nullable=True)
    physician = Column(String, nullable=True)
    agency_id = Column(Integer, nullable=False)
    nursing_diagnosis = Column(Text, nullable=True)
    urgency_level = Column(String, nullable=True)
    prior_level_of_function = Column(Text, nullable=True)
    homebound_status = Column(String, nullable=True)
    weight_bearing_status = Column(String, nullable=True)
    referral_reason = Column(Text, nullable=True)
    weight = Column(String, nullable=True)
    height = Column(String, nullable=True)
    past_medical_history = Column(Text, nullable=True)
    clinical_grouping = Column(String, nullable=True)
    required_disciplines = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    exercise_assignments = relationship("PatientExerciseAssignment", back_populates="patient", primaryjoin="Patient.id == PatientExerciseAssignment.patient_id")
    certification_periods = relationship("CertificationPeriod", back_populates="patient")
    visits = relationship("Visit", back_populates="patient")
    documents = relationship("Document", back_populates="patient")
    staff_assignments = relationship("StaffAssignment", back_populates="patient")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="documents")
    staff = relationship("Staff", back_populates="documents")

class StaffAssignment(Base):
    __tablename__ = "staff_assignments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    staff_id = Column(Integer, ForeignKey("staff.id"))
    assigned_role = Column(String, nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="staff_assignments")
    staff = relationship("Staff", back_populates="assigned_patients")

class CertificationPeriod(Base):
    __tablename__ = "certification_periods"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)

    patient = relationship("Patient", back_populates="certification_periods")
    visits = relationship("Visit", back_populates="certification_period")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    default_sets = Column(Integer, nullable=True)
    default_reps = Column(Integer, nullable=True)
    default_sessions_per_day = Column(Integer, nullable=True)
    hep_required = Column(Boolean, default=True)
    discipline = Column(String, nullable=False)
    focus_area = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

class PatientExerciseAssignment(Base):
    __tablename__ = "patient_exercise_assignments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    sets = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    sessions_per_day = Column(Integer, nullable=True)
    hep_required = Column(Boolean, default=True)

    patient = relationship("Patient", back_populates="exercise_assignments")
    exercise = relationship("Exercise")

class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    certification_period_id = Column(Integer, ForeignKey("certification_periods.id"), nullable=False)
    visit_date = Column(Date, nullable=False)
    visit_type = Column(String, nullable=False)
    therapy_type = Column(String, nullable=False)
    status = Column(String, default="Scheduled")
    scheduled_time = Column(String, nullable=True)
    is_hidden = Column(Boolean, default=False)

    patient = relationship("Patient", back_populates="visits")
    staff = relationship("Staff", back_populates="visits")
    note = relationship("VisitNote", back_populates="visit", uselist=False)
    certification_period = relationship("CertificationPeriod", back_populates="visits")

class VisitNote(Base):
    __tablename__ = "visit_notes"

    id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.id"), nullable=False)
    status = Column(String, default="Scheduled")
    discipline = Column(String, nullable=False)
    note_type = Column(String, nullable=False)

    therapist_signature = Column(Text, nullable=True)
    patient_signature = Column(Text, nullable=True)
    visit_date_signature = Column(Date, nullable=True)

    sections_data = Column(JSON, nullable=True)

    visit = relationship("Visit", back_populates="note")

class NoteSection(Base):
    __tablename__ = "note_sections"

    id = Column(Integer, primary_key=True)
    section_name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_required = Column(Boolean, default=False)
    has_static_image = Column(Boolean, default=False)
    static_image_url = Column(String, nullable=True)
    form_schema = Column(JSON, nullable=True)

class NoteTemplate(Base):
    __tablename__ = "note_templates"

    id = Column(Integer, primary_key=True)
    discipline = Column(String, nullable=False)
    note_type = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    sections = relationship("NoteTemplateSection", back_populates="template", cascade="all, delete-orphan")

class NoteTemplateSection(Base):
    __tablename__ = "note_template_sections"

    id = Column(Integer, primary_key=True)
    template_id = Column(Integer, ForeignKey("note_templates.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("note_sections.id"), nullable=False)
    position = Column(Integer, nullable=True)

    template = relationship("NoteTemplate", back_populates="sections")
    section = relationship("NoteSection")
