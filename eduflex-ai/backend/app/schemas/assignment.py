from pydantic import BaseModel, Field, UUID4
from typing import List, Optional, Any, Dict
from datetime import datetime
from app.models.assignment import AssignmentType, QuestionType

# --- Questions ---

class QuestionBase(BaseModel):
    type: QuestionType
    question_text: str
    options: Optional[List[str]] = None # List of strings for MCQs
    correct_answer: Optional[Any] = None # JSON structure
    marks: int = Field(..., gt=0)

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: UUID4
    assignment_id: UUID4

    class Config:
        from_attributes = True

# --- Assignments ---

class AssignmentBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    subject: str = Field(..., max_length=100)
    due_date: Optional[datetime] = None
    max_marks: int = Field(..., gt=0)
    type: AssignmentType = AssignmentType.ASSIGNMENT

class AssignmentCreate(AssignmentBase):
    # Allow creating questions during assignment creation
    questions: Optional[List[QuestionCreate]] = []

class AssignmentUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    subject: Optional[str] = Field(None, max_length=100)
    due_date: Optional[datetime] = None
    max_marks: Optional[int] = None
    type: Optional[AssignmentType] = None

class AssignmentResponse(AssignmentBase):
    id: UUID4
    faculty_id: UUID4
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True
