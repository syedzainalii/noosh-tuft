from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from auth import get_current_admin_user
from models import User
from cloudinary_service import upload_image, is_base64_image, is_cloudinary_url

router = APIRouter(prefix="/api/upload", tags=["Upload"])


class ImageUploadRequest(BaseModel):
    image: str
    folder: str = "ecommerce"


class ImageUploadResponse(BaseModel):
    url: str


class MultipleImageUploadRequest(BaseModel):
    images: List[str]
    folder: str = "ecommerce"


class MultipleImageUploadResponse(BaseModel):
    urls: List[str]


@router.post("/image", response_model=ImageUploadResponse)
def upload_single_image(
    request: ImageUploadRequest,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Upload a single image to Cloudinary (Admin only)
    Accepts base64 encoded image data
    """
    try:
        # Check if it's already a Cloudinary URL
        if is_cloudinary_url(request.image):
            return ImageUploadResponse(url=request.image)
        
        # Check if it's a base64 image
        if not is_base64_image(request.image):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format. Please provide a base64 encoded image."
            )
        
        # Upload to Cloudinary
        cloudinary_url = upload_image(request.image, request.folder)
        
        return ImageUploadResponse(url=cloudinary_url)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )


@router.post("/images", response_model=MultipleImageUploadResponse)
def upload_multiple_images(
    request: MultipleImageUploadRequest,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Upload multiple images to Cloudinary (Admin only)
    Accepts array of base64 encoded image data
    """
    try:
        uploaded_urls = []
        
        for image_data in request.images:
            # Check if it's already a Cloudinary URL
            if is_cloudinary_url(image_data):
                uploaded_urls.append(image_data)
                continue
            
            # Check if it's a base64 image
            if not is_base64_image(image_data):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid image format. All images must be base64 encoded."
                )
            
            # Upload to Cloudinary
            cloudinary_url = upload_image(image_data, request.folder)
            uploaded_urls.append(cloudinary_url)
        
        return MultipleImageUploadResponse(urls=uploaded_urls)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload images: {str(e)}"
        )
