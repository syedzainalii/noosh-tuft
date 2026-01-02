"""add hero_slides table

Revision ID: 001
Revises: 
Create Date: 2026-01-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create hero_slides table
    op.create_table(
        'hero_slides',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('subtitle', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('button_text', sa.String(), nullable=True),
        sa.Column('button_link', sa.String(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('idx_hero_slides_order', 'hero_slides', ['order_index'])
    op.create_index('idx_hero_slides_active', 'hero_slides', ['is_active'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_hero_slides_active', table_name='hero_slides')
    op.drop_index('idx_hero_slides_order', table_name='hero_slides')
    
    # Drop table
    op.drop_table('hero_slides')
