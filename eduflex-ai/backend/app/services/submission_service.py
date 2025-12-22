from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import Dict, Any

from app.models.submission import Submission, Answer, SubmissionStatus
from app.models.assignment import Assignment, Question, QuestionType
from app.schemas.submission import SubmissionCreate

class SubmissionService:
    def __init__(self, db: Session):
        self.db = db

    async def submit_assignment(self, student_id: UUID, submission_data: SubmissionCreate) -> Submission:
        # 1. Fetch Assignment to validate and get Key
        assignment = self.db.query(Assignment).filter(Assignment.id == submission_data.assignment_id).first()
        if not assignment:
            raise ValueError("Assignment not found")

        # 2. check if already submitted? (Optional, skip for now or allow re-attempts)

        # 3. Create Submission Record
        db_submission = Submission(
            assignment_id=submission_data.assignment_id,
            student_id=student_id,
            status=SubmissionStatus.SUBMITTED,
            submitted_at=datetime.utcnow()
        )
        self.db.add(db_submission)
        self.db.flush() # Get ID

        total_marks = 0

        # 4. Process Answers
        # Fetch all questions for map lookup
        questions_map = {q.id: q for q in assignment.questions}

        for q_id, user_answer in submission_data.answers.items():
            # Ensure q_id is UUID
            if isinstance(q_id, str):
                q_id = UUID(q_id)
            
            question = questions_map.get(q_id)
            if not question:
                continue

            marks_awarded = 0
            feedback = ""
            
            # AUTO GRADING LOGIC
            if question.type == QuestionType.MCQ:
                # Assuming correct_answer is stored as JSON: {"answer": "Option A"}
                correct_val = question.correct_answer.get('answer') if question.correct_answer else None
                if correct_val and str(user_answer) == str(correct_val):
                    marks_awarded = question.marks
                    feedback = "Correct"
                else:
                    feedback = f"Incorrect. Correct answer: {correct_val}"

            elif question.type == QuestionType.DESCRIPTIVE:
                # INTEGRATE AI EVALUATION
                from app.services.ai_service import AIService
                evaluation_result = await AIService.evaluate_answer(
                    question.question_text, str(user_answer), question.marks
                )
                marks_awarded = evaluation_result.get("marks_awarded", 0)
                feedback = evaluation_result.get("feedback", "")
            
            # Create Answer Record
            db_answer = Answer(
                submission_id=db_submission.id,
                question_id=q_id,
                answer_text=str(user_answer) if user_answer else "",
                marks_awarded=marks_awarded,
                feedback=feedback
            )
            self.db.add(db_answer)
            total_marks += marks_awarded

        # 5. Create final Evaluation Summary
        from app.models.submission import Evaluation, EvaluationSource
        db_eval = Evaluation(
            submission_id=db_submission.id,
            evaluated_by=EvaluationSource.AI,
            total_marks=total_marks,
            overall_feedback="Automatic evaluation completed."
        )
        self.db.add(db_eval)
        db_submission.status = SubmissionStatus.EVALUATED

        # Is there a field for total_score on Submission? Not explicitly in my previous model, 
        # but let's assume we can calculate it or store it if we added a column. 
        # The 'Evaluation' table is meant for the final score, but for auto-grades we can populate it?
        # For now, let's just save the answers. 
        
        self.db.commit()
        self.db.refresh(db_submission)
        return db_submission

    def get_student_submissions(self, student_id: UUID):
        return self.db.query(Submission).filter(Submission.student_id == student_id).all()
