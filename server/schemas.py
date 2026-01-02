from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from models import UserRole, OrderStatus


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    compare_at_price: Optional[float] = None
    cost_per_item: Optional[float] = None
    stock_quantity: int = 0
    sku: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    category_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    cost_per_item: Optional[float] = None
    stock_quantity: Optional[int] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    category_id: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Cart Schemas
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    price: float
    
    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    shipping_address: str
    shipping_city: str
    shipping_postal_code: str
    shipping_country: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    status: OrderStatus
    total_amount: float
    shipping_address: str
    shipping_city: str
    shipping_postal_code: str
    shipping_country: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    notes: Optional[str] = None
    order_items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_orders: int
    total_revenue: float
    total_products: int
    total_customers: int
    pending_orders: int
    low_stock_products: int


# Hero Banner Schemas
class HeroBannerBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: str
    button1_text: Optional[str] = None
    button1_url: Optional[str] = None
    button2_text: Optional[str] = None
    button2_url: Optional[str] = None
    is_active: bool = True


class HeroBannerCreate(HeroBannerBase):
    pass


class HeroBannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    button1_text: Optional[str] = None
    button1_url: Optional[str] = None
    button2_text: Optional[str] = None
    button2_url: Optional[str] = None
    is_active: Optional[bool] = None


class HeroBannerResponse(HeroBannerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
