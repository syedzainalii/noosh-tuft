"""
Scheduler for background tasks
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def cleanup_unverified_users():
    """Delete users who haven't verified their email after 24 hours"""
    db: Session = SessionLocal()
    try:
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        unverified_users = db.query(User).filter(
            User.is_verified == False,
            User.created_at < cutoff_time
        ).all()
        
        if unverified_users:
            logger.info(f"Found {len(unverified_users)} unverified users to delete")
            
            for user in unverified_users:
                logger.info(f"Deleting unverified user: {user.email}")
                db.delete(user)
            
            db.commit()
            logger.info(f"Successfully deleted {len(unverified_users)} unverified users")
        else:
            logger.info("No unverified users to delete")
            
    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    """Start the scheduler"""
    # Run cleanup every hour
    scheduler.add_job(
        cleanup_unverified_users,
        trigger=IntervalTrigger(hours=1),
        id='cleanup_unverified_users',
        name='Delete unverified users older than 24 hours',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Scheduler started - cleanup task will run every hour")


def shutdown_scheduler():
    """Shutdown the scheduler"""
    scheduler.shutdown()
    logger.info("Scheduler shutdown")