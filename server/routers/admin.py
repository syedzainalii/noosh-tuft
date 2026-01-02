from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Product, Order, OrderStatus
from schemas import DashboardStats
from auth import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Total orders
    total_orders = db.query(func.count(Order.id)).scalar()
    
    # Total revenue
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    
    # Total products
    total_products = db.query(func.count(Product.id)).scalar()
    
    # Total customers (non-admin users)
    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar()
    
    # Pending orders
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.status == OrderStatus.PENDING
    ).scalar()
    
    # Low stock products (less than 10 items)
    low_stock_products = db.query(func.count(Product.id)).filter(
        Product.stock_quantity < 10
    ).scalar()
    
    return DashboardStats(
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_products=total_products,
        total_customers=total_customers,
        pending_orders=pending_orders,
        low_stock_products=low_stock_products
    )
