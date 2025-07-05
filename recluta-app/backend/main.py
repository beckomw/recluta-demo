from fastapi import FastAPI 
from datetime import datetime 
from enum import Enum 
from typing import Optional, Union, List, Literal 
from pydantic import BaseModel, EmailStr, HttpUrl

app = FastAPI() 




class ApplicationStatus(str, Enum):
    """Enumeration for the status of a job application."""
    APPLIED = "Applied"
    SCREENING = "Screening"
    INTERVIEW = "Interview"
    OFFERED = "Offered"
    HIRED = "Hired"
    REJECTED = "Rejected"

class Job(BaseModel):
    """Represents a job opening."""
    id: int
    title: str
    department: str
    is_open: bool = True
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class Candidate(BaseModel):
    """Represents a candidate."""
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin_profile: Optional[HttpUrl] = None
    status: ApplicationStatus = ApplicationStatus.APPLIED
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
class Note(BaseModel):
    """Represents a note about a candidate."""
    id: int
    candidate_id: int
    content: str
    created_at: datetime = datetime.now()

class Application(BaseModel):
    """Represents the association between a candidate and a job."""
    id: int
    candidate_id: int
    job_id: int
    applied_at: datetime = datetime.now()

