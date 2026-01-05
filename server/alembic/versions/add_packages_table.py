"""add packages table

Revision ID: add_packages_table
Revises: add_hero_banner_buttons
Create Date: 2026-01-03

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_packages_table'
down_revision = 'add_hero_banner_buttons'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'packages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('duration', sa.String(), nullable=True),
        sa.Column('features', sa.Text(), nullable=True),
        sa.Column('is_popular', sa.Boolean(), nullable=True, default=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('order_index', sa.Integer(), nullable=True, default=0),
        sa.Column('button_text', sa.String(), nullable=True, default='Get Started'),
        sa.Column('button_link', sa.String(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('color_scheme', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_packages_id'), 'packages', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_packages_id'), table_name='packages')
    op.drop_table('packages')
