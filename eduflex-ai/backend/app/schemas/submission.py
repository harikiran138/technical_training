from pydantic import BaseModel, UUID4
from typing import List, Optional, Any, Dict
from datetime import datetime
from app.models.submission import SubmissionStatus

class AnswerCreate(BaseModel):
    question_id: UUID4
    # For MCQ, this is the selected option string. For Descriptive, the text answer.
    # We use 'Any' or specific fields. Let's send a flexible payload.
    answer_text: Optional[str] = None 
    selected_options: Optional[List[str]] = None # For multi-select or single select stored as list

class SubmissionCreate(BaseModel):
    assignment_id: UUID4
    # Map of question_id -> answer value (string or list of strings)
    answers: Dict[UUID4, Any] 

class AnswerResponse(BaseModel):
    id: UUID4
    question_id: UUID4
    answer_text: Optional[str]
    marks_awarded: Optional[int]
    feedback: Optional[str]

    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: UUID4
    assignment_id: UUID4
    student_id: UUID4
    status: SubmissionStatus
    submitted_at: datetime
    total_score: Optional[int] = 0
    answers: List[AnswerResponse] = []

    class Config:
        from_attributes = True
