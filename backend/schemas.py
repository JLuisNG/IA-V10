from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, date

#/////////////////////////////// STAFF ////////////////////////////////#

class StaffBase(BaseModel):
    name: str
    birthday: Optional[date] = None
    gender: Optional[str] = None
    postal_code: Optional[str] = None
    email: str
    phone: Optional[str] = None
    alt_phone: Optional[str] = None
    username: str
    password: str
    rol: str
    activo: bool

class StaffCreate(StaffBase):
    pass

class StaffUpdate(StaffBase):
    name: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None

    class Config:
        from_attributes = True

class StaffResponse(BaseModel):
    id: int
    name: str
    email: str
    rol: str

    class Config:
        from_attributes = True

class StaffAssignmentBase(BaseModel):
    paciente_id: int
    staff_id: int

class StaffAssignmentCreate(StaffAssignmentBase):
    pass

class StaffAssignmentResponse(BaseModel):
    id: int
    fecha_asignacion: datetime
    rol_asignado: str
    staff: StaffResponse

    class Config:
        from_attributes = True

#//////////////////////////// DOCUMENTOS //////////////////////////#

class DocumentoBase(BaseModel):
    paciente_id: Optional[int] = None
    staff_id: Optional[int] = None
    file_name: str

class DocumentoCreate(DocumentoBase):
    ruta_archivo: str

class DocumentoResponse(DocumentoBase):
    id: int
    ruta_archivo: str
    fecha_subida: datetime

    class Config:
        from_attributes = True

#/////////////////////////////// PACIENTES ////////////////////////////////#

class PacienteBase(BaseModel):
    patient_name: str
    birthday: date
    gender: str
    address: str
    contact_info: Optional[str] = None  
    payor_type: Optional[str] = None
    physician: Optional[str] = None
    agency_id: int
    nursing_diagnostic: Optional[str] = None
    urgency_level: Optional[str] = None
    prior_level_of_function: Optional[str] = None
    homebound: Optional[str] = None
    weight_bearing_status: Optional[str] = None
    reason_for_referral: Optional[str] = None
    weight: Optional[str] = None
    height: Optional[str] = None
    pmh: Optional[str] = None
    clinical_grouping: Optional[str] = None
    disciplines_needed: Optional[str] = None 
    activo: Optional[bool] = True

class PacienteCreate(PacienteBase):
    initial_cert_start_date: date

class PacienteUpdate(PacienteBase):
    patient_name: Optional[str] = None
    birthday: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    agency_id: Optional[int] = None

    class Config:
        from_attributes = True

class PacienteResponse(PacienteBase):
    id_paciente: int

    class Config:
        from_attributes = True

#//////////////////////////// EJERCICIOS //////////////////////////#

class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    default_sets: Optional[int] = None
    default_reps: Optional[int] = None
    default_sessions_per_day: Optional[int] = None
    hep_required: Optional[bool] = True
    discipline: str  
    focus_area: Optional[str] = None
    is_active: Optional[bool] = True

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseUpdate(ExerciseBase):
    name: Optional[str] = None
    discipline: Optional[str] = None

    class Config:
        from_attributes = True

class ExerciseResponse(ExerciseBase):
    id: int
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True      

class PacienteExerciseAssignmentBase(BaseModel):
    paciente_id: int
    exercise_id: int
    sets: Optional[int] = None
    reps: Optional[int] = None
    sessions_per_day: Optional[int] = None
    hep_required: Optional[bool] = True

class PacienteExerciseAssignmentCreate(PacienteExerciseAssignmentBase):
    pass

class PacienteExerciseAssignmentResponse(PacienteExerciseAssignmentBase):
    id: int

    class Config:
        from_attributes = True

#//////////////////////////// VISITAS y NOTAS //////////////////////////#

class VisitBase(BaseModel):
    paciente_id: int
    staff_id: int
    certification_period_id: int
    visit_date: date
    visit_type: str
    therapy_type: str
    status: Optional[str] = "Scheduled"
    scheduled_time: Optional[str] = None

class VisitCreate(VisitBase):
    pass

class VisitResponse(VisitBase):
    id: int
    note_id: Optional[int] = None

    class Config:
        from_attributes = True

# --- Notas ---

class VisitNoteBase(BaseModel):
    visit_id: int
    status: Optional[str] = "Scheduled"
    discipline: str 
    note_type: str     
    therapist_signature: Optional[str] = None
    patient_signature: Optional[str] = None
    visit_date_signature: Optional[str] = None

class VisitNoteCreate(VisitNoteBase):
    pass

class VisitNoteResponse(VisitNoteBase):
    id: int

    class Config:
        from_attributes = True
        
# --- NoteSections ---

class NoteSectionBase(BaseModel):
    section_name: str
    description: Optional[str] = None
    is_required: Optional[bool] = False
    has_static_image: Optional[bool] = False
    static_image_url: Optional[str] = None
    form_schema: Optional[Dict] = None 

class NoteSectionCreate(NoteSectionBase):
    pass

class NoteSectionUpdate(BaseModel):
    section_name: Optional[str] = None
    description: Optional[str] = None
    is_required: Optional[bool] = None
    has_static_image: Optional[bool] = None
    static_image_url: Optional[str] = None
    form_schema: Optional[Dict] = None

    class Config:
        from_attributes = True

class NoteSectionResponse(NoteSectionBase):
    id: int

    class Config:
        from_attributes = True

# --- NoteTemplate ---

class NoteTemplateBase(BaseModel):
    discipline: str
    note_type: str
    is_active: bool = True

class NoteTemplateCreate(NoteTemplateBase):
    section_ids: List[int]

class NoteTemplateUpdate(BaseModel):
    discipline: Optional[str] = None
    note_type: Optional[str] = None
    is_active: Optional[bool] = None

    replace_section_ids: Optional[List[int]] = None
    add_section_ids: Optional[List[int]] = None
    remove_section_ids: Optional[List[int]] = None

    class Config:
        from_attributes = True

class NoteTemplateResponse(NoteTemplateBase):
    id: int

    class Config:
        from_attributes = True

# --- NoteTemplateSection ---

class NoteTemplateWithSectionsResponse(BaseModel):
    id: int
    discipline: str
    note_type: str
    is_active: bool
    sections: List[NoteSectionResponse]

    class Config:
        from_attributes = True

#//////////////////////////// CERT PERIODS //////////////////////////#

class CertificationPeriodBase(BaseModel):
    start_date: date
    end_date: date
    is_active: bool = True

class CertificationPeriodResponse(CertificationPeriodBase):
    id: int
    paciente_id: int

    class Config:
        from_attributes = True

class CertificationPeriodUpdate(CertificationPeriodBase):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None
    
    class Config:
        from_attributes = True