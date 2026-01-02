"""add hero banners table

Revision ID: add_hero_banners
Revises: 
Create Date: 2026-01-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_hero_banners'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create hero_banners table
    op.create_table(
        'hero_banners',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('subtitle', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hero_banners_id'), 'hero_banners', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_hero_banners_id'), table_name='hero_banners')
    op.drop_table('hero_banners')
