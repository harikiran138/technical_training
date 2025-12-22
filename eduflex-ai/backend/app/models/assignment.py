from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.core.database import Base

class AssignmentType(str, enum.Enum):
    ASSIGNMENT = "assignment"
    QUIZ = "quiz"

class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    DESCRIPTIVE = "DESCRIPTIVE"

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), nullable=False)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    max_marks = Column(Integer, nullable=False)
    type = Column(SQLEnum(AssignmentType), default=AssignmentType.ASSIGNMENT, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    questions = relationship("Question", back_populates="assignment", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="assignment")
    # faculty relationship can be added if User model has backref or we define it here, 
    # but strictly not needed for migration unless we want ORM navigation

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False)
    type = Column(SQLEnum(QuestionType), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True) # For MCQs: ["Option A", "Option B", ...]
    correct_answer = Column(JSONB, nullable=True) # For Auto-eval: {"answer": "Option A"} or text
    marks = Column(Integer, nullable=False)

    # Relationships
    assignment = relationship("Assignment", back_populates="questions")


class AssignmentAnalytics(Base):
    __tablename__ = "assignment_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id"), unique=True)
    
    # Numeric Metrics
    total_submissions = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    max_score_achieved = Column(Float, default=0.0)
    min_score_achieved = Column(Float, default=0.0)
    
    # AI Insights (JSONB)
    ai_insights = Column(JSONB, nullable=True) # Stores the master prompt output
    
    last_updated = Column(DateTime, default=func.now())

    assignment = relationship("Assignment", back_populates="analytics")

# Add analytics relationship to Assignment
Assignment.analytics = relationship("AssignmentAnalytics", uselist=False, back_populates="assignment")
