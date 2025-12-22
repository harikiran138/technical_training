from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
import datetime
from typing import Dict, Any, List

from app.models.assignment import Assignment, AssignmentAnalytics, Question
from app.models.submission import Submission, Answer, SubmissionStatus

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def generate_assignment_analytics(self, assignment_id: UUID) -> Dict[str, Any]:
        """
        Calculates numeric metrics and generates AI insights for an assignment.
        """
        # 1. Fetch Assignment and Analytics record
        assignment = self.db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise ValueError("Assignment not found")
        
        analytics_record = self.db.query(AssignmentAnalytics).filter(
            AssignmentAnalytics.assignment_id == assignment_id
        ).first()

        if not analytics_record:
            analytics_record = AssignmentAnalytics(assignment_id=assignment_id)
            self.db.add(analytics_record)

        # 2. Aggregations (SQL/Python)
        submissions = self.db.query(Submission).filter(
            Submission.assignment_id == assignment_id,
            Submission.status == SubmissionStatus.SUBMITTED # Only consider submitted? or graded?
            # Assuming SUBMITTED includes auto-graded ones. If Evaluation is separate, 
            # we might need to look at Evaluation table. 
            # For now, let's use the Answers directly for raw stats.
        ).all()

        total_submissions = len(submissions)
        if total_submissions == 0:
            return {"message": "No submissions to analyze"}

        # Calculate scores
        scores = []
        for sub in submissions:
            # Simple sum of marks_awarded from Answers
            # Ideally this should be cached on Submission model, but summing is fine for MVP
            score = sum(a.marks_awarded for a in sub.answers) if sub.answers else 0
            scores.append(score)

        avg_score = sum(scores) / total_submissions if scores else 0
        max_score = max(scores) if scores else 0
        min_score = min(scores) if scores else 0

        # Update Record
        analytics_record.total_submissions = total_submissions
        analytics_record.average_score = avg_score
        analytics_record.max_score_achieved = max_score
        analytics_record.min_score_achieved = min_score
        analytics_record.last_updated = datetime.datetime.utcnow()

        # 3. Question-level Analysis
        question_stats = []
        for question in assignment.questions:
            # Count correct answers
            # This is complex for descriptive, but for MCQ: marks_awarded == question.marks
            correct_count = 0
            total_attempted = 0
            
            # This query could be optimized with SQL group_by
            answers = self.db.query(Answer).filter(Answer.question_id == question.id).all()
            for ans in answers:
                total_attempted += 1
                if ans.marks_awarded == question.marks:
                    correct_count += 1
            
            correct_rate = (correct_count / total_attempted) if total_attempted > 0 else 0
            
            question_stats.append({
                "question_id": str(question.id),
                "type": question.type.value,
                "text": question.question_text[:50] + "...",
                "correct_rate": correct_rate,
                "avg_marks": sum(a.marks_awarded for a in answers) / total_attempted if total_attempted > 0 else 0
            })

        self.db.commit()

        # 4. Prepare Payload for AI
        ai_payload = {
            "assignment_id": str(assignment.id),
            "max_marks": assignment.max_marks,
            "students": total_submissions,
            "average_score": round(avg_score, 2),
            "completion_rate": 0.0, # Need total students count to calc this
            "questions": question_stats,
            "student_scores": [{"student_id": str(s.student_id), "score": sc} for s, sc in zip(submissions, scores)]
        }

        # 5. Call AI (Placeholder)
        # In a real impl, this calls Gemini/OpenAI with the Master Prompt
        # updated logic to fetch insights.
        ai_insights = self._mock_ai_insights(ai_payload)
        
        analytics_record.ai_insights = ai_insights
        self.db.commit()
        
        return {
            "metrics": ai_payload,
            "insights": ai_insights
        }

    def _mock_ai_insights(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Placeholder for the AI interpretation layer.
        Returns a deterministic JSON structure based on the numbers.
        """
        avg = payload["average_score"]
        maxx = payload["max_marks"]
        
        difficulty = "Medium"
        if avg / maxx > 0.8:
            difficulty = "Easy"
        elif avg / maxx < 0.4:
            difficulty = "Hard"

        return {
            "assignment_difficulty": difficulty,
            "overall_summary": f"The assignment '{difficulty}' difficulty. Average score is {avg}/{maxx}.",
            "student_insights": {
                "high_performers": [s["student_id"] for s in payload["student_scores"] if s["score"] > maxx * 0.9],
                "at_risk_students": [s["student_id"] for s in payload["student_scores"] if s["score"] < maxx * 0.4],
                "improvement_trend": "Stable"
            },
            "question_insights": [], 
            "teaching_recommendations": [
                "Review the concepts covered in the questions with low correct rates.",
                "Provide more practice examples for descriptive questions."
            ],
            "confidence_score": 0.95
        }
