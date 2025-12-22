
from app.core.database import engine, Base
from app.models.user import User
from app.models.assignment import Assignment, Question, AssignmentAnalytics
from app.models.submission import Submission, Answer, Evaluation

from app.core.config import settings
print(f"Connecting to: {settings.DATABASE_URL}")
print("Creating tables in database...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
