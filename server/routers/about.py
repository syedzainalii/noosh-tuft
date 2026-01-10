from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import AboutPage, User
from schemas import AboutPageCreate, AboutPageUpdate, AboutPageResponse
from auth import get_current_admin_user

router = APIRouter(prefix="/api/about", tags=["About"])


@router.get("", response_model=Optional[AboutPageResponse])
def get_about_page(db: Session = Depends(get_db)):
    """Get the about page content (public)"""
    about = db.query(AboutPage).first()
    return about


@router.post("", response_model=AboutPageResponse, status_code=status.HTTP_201_CREATED)
def create_about_page(
    about: AboutPageCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create about page content (admin only)"""
    # Check if about page already exists
    existing = db.query(AboutPage).first()
    if existing:
        raise HTTPException(status_code=400, detail="About page already exists. Use PUT to update.")
    
    # Image URL comes directly from frontend (already uploaded to Cloudinary)
    about_data = about.dict()
    
    db_about = AboutPage(**about_data)
    db.add(db_about)
    db.commit()
    db.refresh(db_about)
    return db_about


@router.put("", response_model=AboutPageResponse)
def update_about_page(
    about: AboutPageUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update about page content (admin only)"""
    db_about = db.query(AboutPage).first()
    if not db_about:
        raise HTTPException(status_code=404, detail="About page not found. Create it first.")
    
    # Image URL comes directly from frontend (already uploaded to Cloudinary)
    update_data = about.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_about, field, value)
    
    db.commit()
    db.refresh(db_about)
    return db_about


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_about_page(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete about page content (admin only)"""
    db_about = db.query(AboutPage).first()
    if not db_about:
        raise HTTPException(status_code=404, detail="About page not found")
    
    db.delete(db_about)
    db.commit()
    return None
