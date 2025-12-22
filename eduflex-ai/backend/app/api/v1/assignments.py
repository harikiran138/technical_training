from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.schemas.assignment import AssignmentCreate, AssignmentResponse
from app.services.assignment_service import AssignmentService

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new assignment or quiz.
    Only Faculty can populate this.
    """
    if current_user.role not in [UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can create assignments"
        )
    
    service = AssignmentService(db)
    return service.create_assignment(assignment_data, current_user.id)

@router.get("/", response_model=List[AssignmentResponse])
def list_assignments(
    skip: int = 0, 
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all assignments. 
    (Future: Filter by student's department/subject)
    """
    service = AssignmentService(db)
    return service.get_assignments(skip, limit)

@router.get("/{id}", response_model=AssignmentResponse)
def get_assignment(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get assignment details.
    """
    service = AssignmentService(db)
    assignment = service.get_assignment(id)
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    return assignment
