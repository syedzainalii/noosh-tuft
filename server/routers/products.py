from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Product, User
from schemas import ProductCreate, ProductUpdate, ProductResponse
from auth import get_current_admin_user
from cloudinary_service import upload_image, is_base64_image, is_cloudinary_url, delete_image
import json

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) | 
            (Product.description.ilike(f"%{search}%"))
        )
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Check if slug already exists
    existing_product = db.query(Product).filter(Product.slug == product_data.slug).first()
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists"
        )
    
    # Check if SKU already exists
    if product_data.sku:
        existing_sku = db.query(Product).filter(Product.sku == product_data.sku).first()
        if existing_sku:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this SKU already exists"
            )
    
    # Upload main image to Cloudinary if it's base64 (fallback - frontend should upload directly)
    if product_data.image_url and is_base64_image(product_data.image_url):
        product_data.image_url = upload_image(product_data.image_url, "ecommerce/products")
    
    # Upload additional images to Cloudinary if they're base64 (fallback)
    if product_data.images:
        try:
            images_list = json.loads(product_data.images) if isinstance(product_data.images, str) else product_data.images
            uploaded_images = []
            for img in images_list:
                if is_base64_image(img):
                    uploaded_images.append(upload_image(img, "ecommerce/products"))
                else:
                    uploaded_images.append(img)
            product_data.images = json.dumps(uploaded_images)
        except:
            pass
    
    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if slug is being updated and if it already exists
    if product_data.slug and product_data.slug != product.slug:
        existing_product = db.query(Product).filter(Product.slug == product_data.slug).first()
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this slug already exists"
            )
    
    # Upload main image to Cloudinary if it's base64 (fallback - frontend should upload directly)
    if product_data.image_url and is_base64_image(product_data.image_url):
        # Delete old image if it exists and is a Cloudinary URL
        if product.image_url and is_cloudinary_url(product.image_url):
            delete_image(product.image_url)
        product_data.image_url = upload_image(product_data.image_url, "ecommerce/products")
    
    # Upload additional images to Cloudinary if they're base64 (fallback)
    if product_data.images:
        try:
            images_list = json.loads(product_data.images) if isinstance(product_data.images, str) else product_data.images
            uploaded_images = []
            for img in images_list:
                if is_base64_image(img):
                    uploaded_images.append(upload_image(img, "ecommerce/products"))
                else:
                    uploaded_images.append(img)
            product_data.images = json.dumps(uploaded_images)
        except:
            pass
    
    # Update product fields
    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return None
