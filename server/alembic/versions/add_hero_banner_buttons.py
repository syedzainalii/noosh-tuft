"""add hero banner buttons

Revision ID: add_hero_banner_buttons
Revises: add_hero_banners
Create Date: 2026-01-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_hero_banner_buttons'
down_revision = 'add_hero_banners'
branch_labels = None
depends_on = None


def upgrade():
    # Add button columns to hero_banners table
    op.add_column('hero_banners', sa.Column('button1_text', sa.String(), nullable=True))
    op.add_column('hero_banners', sa.Column('button1_url', sa.String(), nullable=True))
    op.add_column('hero_banners', sa.Column('button2_text', sa.String(), nullable=True))
    op.add_column('hero_banners', sa.Column('button2_url', sa.String(), nullable=True))


def downgrade():
    op.drop_column('hero_banners', 'button2_url')
    op.drop_column('hero_banners', 'button2_text')
    op.drop_column('hero_banners', 'button1_url')
    op.drop_column('hero_banners', 'button1_text')
