from sqlalchemy.orm import Session
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID

from app.models.assignment import Assignment, Question, AssignmentType
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, QuestionCreate

class AssignmentService:
    def __init__(self, db: Session):
        self.db = db

    def create_assignment(self, assignment_data: AssignmentCreate, faculty_id: UUID) -> Assignment:
        # 1. Create Assignment
        db_assignment = Assignment(
            title=assignment_data.title,
            description=assignment_data.description,
            subject=assignment_data.subject,
            faculty_id=faculty_id,
            due_date=assignment_data.due_date,
            max_marks=assignment_data.max_marks,
            type=assignment_data.type
        )
        self.db.add(db_assignment)
        self.db.flush() # flush to get ID

        # 2. Create Questions if any
        if assignment_data.questions:
            for q_data in assignment_data.questions:
                db_question = Question(
                    assignment_id=db_assignment.id,
                    type=q_data.type,
                    question_text=q_data.question_text,
                    options=q_data.options,
                    correct_answer=q_data.correct_answer,
                    marks=q_data.marks
                )
                self.db.add(db_question)
        
        self.db.commit()
        self.db.refresh(db_assignment)
        return db_assignment

    def get_assignments(self, skip: int = 0, limit: int = 100) -> List[Assignment]:
        return self.db.query(Assignment).offset(skip).limit(limit).all()

    def get_assignment(self, assignment_id: UUID) -> Optional[Assignment]:
        return self.db.query(Assignment).filter(Assignment.id == assignment_id).first()
