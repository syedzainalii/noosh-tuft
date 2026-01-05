from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Package, User
from schemas import PackageCreate, PackageUpdate, PackageResponse
from auth import get_current_admin_user

router = APIRouter(prefix="/api/packages", tags=["Packages"])


@router.get("/", response_model=List[PackageResponse])
def get_packages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all active packages ordered by order_index"""
    packages = db.query(Package).filter(
        Package.is_active == True
    ).order_by(Package.order_index).offset(skip).limit(limit).all()
    return packages


@router.get("/all", response_model=List[PackageResponse])
def get_all_packages(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all packages (admin only)"""
    packages = db.query(Package).order_by(Package.order_index).all()
    return packages


@router.get("/{package_id}", response_model=PackageResponse)
def get_package(package_id: int, db: Session = Depends(get_db)):
    """Get a specific package"""
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package


@router.post("/", response_model=PackageResponse)
def create_package(
    package: PackageCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new package (admin only)"""
    db_package = Package(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package


@router.put("/{package_id}", response_model=PackageResponse)
def update_package(
    package_id: int,
    package: PackageUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a package (admin only)"""
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    update_data = package.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_package, field, value)
    
    db.commit()
    db.refresh(db_package)
    return db_package


@router.delete("/{package_id}")
def delete_package(
    package_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a package (admin only)"""
    db_package = db.query(Package).filter(Package.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    db.delete(db_package)
    db.commit()
    return {"message": "Package deleted successfully"}
