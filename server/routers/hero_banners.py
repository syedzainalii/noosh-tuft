from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import HeroBanner, User
from schemas import HeroBannerCreate, HeroBannerUpdate, HeroBannerResponse
from auth import get_current_admin_user

router = APIRouter(prefix="/api/hero-banners", tags=["Hero Banners"])


@router.get("/active", response_model=List[HeroBannerResponse])
def get_active_hero_banners(db: Session = Depends(get_db)):
    """Get all active hero banners for slideshow on home page"""
    banners = db.query(HeroBanner).filter(HeroBanner.is_active == True).order_by(HeroBanner.created_at.desc()).all()
    return banners


@router.get("", response_model=List[HeroBannerResponse])
def get_all_hero_banners(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all hero banners (admin only)"""
    banners = db.query(HeroBanner).order_by(HeroBanner.created_at.desc()).all()
    return banners


@router.post("", response_model=HeroBannerResponse, status_code=status.HTTP_201_CREATED)
def create_hero_banner(
    banner: HeroBannerCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new hero banner (admin only)"""
    # Allow multiple active banners for slideshow
    db_banner = HeroBanner(**banner.dict())
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner


@router.put("/{banner_id}", response_model=HeroBannerResponse)
def update_hero_banner(
    banner_id: int,
    banner: HeroBannerUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a hero banner (admin only)"""
    db_banner = db.query(HeroBanner).filter(HeroBanner.id == banner_id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Hero banner not found")
    
    update_data = banner.dict(exclude_unset=True)
    
    # Allow multiple active banners for slideshow
    for field, value in update_data.items():
        setattr(db_banner, field, value)
    
    db.commit()
    db.refresh(db_banner)
    return db_banner


@router.delete("/{banner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_banner(
    banner_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a hero banner (admin only)"""
    db_banner = db.query(HeroBanner).filter(HeroBanner.id == banner_id).first()
    if not db_banner:
        raise HTTPException(status_code=404, detail="Hero banner not found")
    
    db.delete(db_banner)
    db.commit()
    return None
