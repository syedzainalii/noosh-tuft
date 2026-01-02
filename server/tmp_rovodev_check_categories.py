from database import SessionLocal
from models import Category

db = SessionLocal()
cats = db.query(Category).all()
print(f'Total categories: {len(cats)}')
for c in cats:
    print(f'- {c.name} ({c.slug})')
db.close()
