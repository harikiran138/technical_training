from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.user_service import UserService
from app.models.user import User, UserRole
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/students", response_model=List[UserResponse])
def get_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get list of all students.
    """
    # Optional: Check if current_user is Faculty/Admin
    user_service = UserService(db)
    students = user_service.get_users_by_role(UserRole.STUDENT)
    return students

@router.get("/{user_id}/report")
def get_student_report(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific student's report card (Mock Data).
    """
    user_service = UserService(db)
    student = user_service.get_by_id(user_id)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
        
    if student.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a student"
        )

    # Real Report Data from service
    report = user_service.get_student_academic_report(user_id)
    if not report:
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate report"
        )
    return report
