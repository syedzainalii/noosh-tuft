from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database import get_db
from models import ProductReview, User, Product, Order, OrderItem
from auth import get_current_user
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    comment: str


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    user_name: str
    rating: int
    title: Optional[str]
    comment: str
    is_verified_purchase: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProductRatingResponse(BaseModel):
    average_rating: float
    total_reviews: int
    rating_distribution: dict  # {5: count, 4: count, etc.}


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new product review"""
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == review.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if user already reviewed this product
    existing_review = db.query(ProductReview).filter(
        ProductReview.product_id == review.product_id,
        ProductReview.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Check if user purchased this product
    has_purchased = db.query(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        OrderItem.product_id == review.product_id,
        Order.status.in_(["delivered", "processing", "shipped"])
    ).first() is not None
    
    # Create review
    db_review = ProductReview(
        product_id=review.product_id,
        user_id=current_user.id,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        is_verified_purchase=has_purchased
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Add user_name for response
    db_review.user_name = current_user.full_name
    
    return db_review


@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(
    product_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all reviews for a product"""
    
    reviews = db.query(ProductReview).filter(
        ProductReview.product_id == product_id
    ).order_by(ProductReview.created_at.desc()).offset(skip).limit(limit).all()
    
    # Add user names
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        review.user_name = user.full_name if user else "Anonymous"
    
    return reviews


@router.get("/product/{product_id}/rating", response_model=ProductRatingResponse)
def get_product_rating(product_id: int, db: Session = Depends(get_db)):
    """Get average rating and distribution for a product"""
    
    # Get average rating and count
    result = db.query(
        func.avg(ProductReview.rating).label('average'),
        func.count(ProductReview.id).label('total')
    ).filter(ProductReview.product_id == product_id).first()
    
    average_rating = float(result.average) if result.average else 0.0
    total_reviews = result.total
    
    # Get rating distribution
    distribution = {}
    for rating in range(1, 6):
        count = db.query(ProductReview).filter(
            ProductReview.product_id == product_id,
            ProductReview.rating == rating
        ).count()
        distribution[str(rating)] = count
    
    return {
        "average_rating": round(average_rating, 1),
        "total_reviews": total_reviews,
        "rating_distribution": distribution
    }


@router.get("/my-reviews", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reviews by current user"""
    
    reviews = db.query(ProductReview).filter(
        ProductReview.user_id == current_user.id
    ).order_by(ProductReview.created_at.desc()).all()
    
    # Add user name
    for review in reviews:
        review.user_name = current_user.full_name
    
    return reviews


@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a review (only by review owner)"""
    
    db_review = db.query(ProductReview).filter(ProductReview.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check ownership
    if db_review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own reviews"
        )
    
    # Update fields
    if review_update.rating is not None:
        db_review.rating = review_update.rating
    if review_update.title is not None:
        db_review.title = review_update.title
    if review_update.comment is not None:
        db_review.comment = review_update.comment
    
    db.commit()
    db.refresh(db_review)
    
    # Add user name
    db_review.user_name = current_user.full_name
    
    return db_review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a review (only by review owner or admin)"""
    
    db_review = db.query(ProductReview).filter(ProductReview.id == review_id).first()
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check ownership or admin
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews"
        )
    
    db.delete(db_review)
    db.commit()
    
    return None
