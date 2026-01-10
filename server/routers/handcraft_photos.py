from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import HandcraftPhoto, User, UserRole
from auth import get_current_user
from pydantic import BaseModel
from cloudinary_service import upload_image, is_base64_image, is_cloudinary_url, delete_image

router = APIRouter(prefix="/api/handcraft-photos", tags=["handcraft-photos"])


class HandcraftPhotoCreate(BaseModel):
    title: str
    description: str = ""
    image_url: str
    order_index: int = 0


class HandcraftPhotoUpdate(BaseModel):
    title: str = None
    description: str = None
    image_url: str = None
    order_index: int = None


class HandcraftPhotoResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    order_index: int
    created_at: str

    class Config:
        from_attributes = True


@router.get("", response_model=List[HandcraftPhotoResponse])
def get_handcraft_photos(db: Session = Depends(get_db)):
    """Get all handcraft photos ordered by order_index"""
    photos = db.query(HandcraftPhoto).order_by(HandcraftPhoto.order_index).all()
    return photos


@router.post("", response_model=HandcraftPhotoResponse, status_code=status.HTTP_201_CREATED)
def create_handcraft_photo(
    photo: HandcraftPhotoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new handcraft photo (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can add handcraft photos"
        )
    
    # Upload image to Cloudinary if it's base64
    image_url = photo.image_url
    if is_base64_image(image_url):
        image_url = upload_image(image_url, "ecommerce/handcrafts")
    
    db_photo = HandcraftPhoto(
        title=photo.title,
        description=photo.description,
        image_url=image_url,
        order_index=photo.order_index
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo


@router.put("/{photo_id}", response_model=HandcraftPhotoResponse)
def update_handcraft_photo(
    photo_id: int,
    photo: HandcraftPhotoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a handcraft photo (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update handcraft photos"
        )
    
    db_photo = db.query(HandcraftPhoto).filter(HandcraftPhoto.id == photo_id).first()
    if not db_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    if photo.title is not None:
        db_photo.title = photo.title
    if photo.description is not None:
        db_photo.description = photo.description
    if photo.image_url is not None:
        # Upload image to Cloudinary if it's base64
        if is_base64_image(photo.image_url):
            # Delete old image if it exists and is a Cloudinary URL
            if db_photo.image_url and is_cloudinary_url(db_photo.image_url):
                delete_image(db_photo.image_url)
            db_photo.image_url = upload_image(photo.image_url, "ecommerce/handcrafts")
        else:
            db_photo.image_url = photo.image_url
    if photo.order_index is not None:
        db_photo.order_index = photo.order_index
    
    db.commit()
    db.refresh(db_photo)
    return db_photo


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_handcraft_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a handcraft photo (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete handcraft photos"
        )
    
    db_photo = db.query(HandcraftPhoto).filter(HandcraftPhoto.id == photo_id).first()
    if not db_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found"
        )
    
    db.delete(db_photo)
    db.commit()
    return None
