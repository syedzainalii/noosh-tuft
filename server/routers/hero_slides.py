from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import HeroSlide, User, UserRole
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/hero-slides", tags=["hero-slides"])


class HeroSlideCreate(BaseModel):
    title: str
    subtitle: str = ""
    image_url: str
    button_text: str = ""
    button_link: str = ""
    order_index: int = 0
    is_active: bool = True


class HeroSlideUpdate(BaseModel):
    title: str = None
    subtitle: str = None
    image_url: str = None
    button_text: str = None
    button_link: str = None
    order_index: int = None
    is_active: bool = None


class HeroSlideResponse(BaseModel):
    id: int
    title: str
    subtitle: str
    image_url: str
    button_text: str
    button_link: str
    order_index: int
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True


@router.get("", response_model=List[HeroSlideResponse])
def get_hero_slides(
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    """Get all hero slides (active only by default)"""
    query = db.query(HeroSlide)
    
    if not include_inactive:
        query = query.filter(HeroSlide.is_active == True)
    
    slides = query.order_by(HeroSlide.order_index).all()
    return slides


@router.post("", response_model=HeroSlideResponse, status_code=status.HTTP_201_CREATED)
def create_hero_slide(
    slide: HeroSlideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new hero slide (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can add hero slides"
        )
    
    db_slide = HeroSlide(
        title=slide.title,
        subtitle=slide.subtitle,
        image_url=slide.image_url,
        button_text=slide.button_text,
        button_link=slide.button_link,
        order_index=slide.order_index,
        is_active=slide.is_active
    )
    db.add(db_slide)
    db.commit()
    db.refresh(db_slide)
    return db_slide


@router.put("/{slide_id}", response_model=HeroSlideResponse)
def update_hero_slide(
    slide_id: int,
    slide: HeroSlideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a hero slide (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update hero slides"
        )
    
    db_slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found"
        )
    
    if slide.title is not None:
        db_slide.title = slide.title
    if slide.subtitle is not None:
        db_slide.subtitle = slide.subtitle
    if slide.image_url is not None:
        db_slide.image_url = slide.image_url
    if slide.button_text is not None:
        db_slide.button_text = slide.button_text
    if slide.button_link is not None:
        db_slide.button_link = slide.button_link
    if slide.order_index is not None:
        db_slide.order_index = slide.order_index
    if slide.is_active is not None:
        db_slide.is_active = slide.is_active
    
    db.commit()
    db.refresh(db_slide)
    return db_slide


@router.delete("/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_slide(
    slide_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a hero slide (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete hero slides"
        )
    
    db_slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found"
        )
    
    db.delete(db_slide)
    db.commit()
    return None
