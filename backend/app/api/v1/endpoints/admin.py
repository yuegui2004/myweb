from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.user import UserInDB
from app.models.user import User
from app.models.question import Question
from datetime import datetime, timedelta

router = APIRouter()

async def get_admin_user(
    current_user: UserInDB = Depends(get_current_user),
):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    return current_user

@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: UserInDB = Depends(get_admin_user)
):
    # 获取用户统计
    total_users = await db.scalar(select(func.count(User.id)))
    premium_users = await db.scalar(
        select(func.count(User.id)).where(User.subscription_type == "premium")
    )

    # 获取问题统计
    total_questions = await db.scalar(select(func.count(Question.id)))
    today = datetime.utcnow().date()
    questions_today = await db.scalar(
        select(func.count(Question.id))
        .where(func.date(Question.created_at) == today)
    )

    return {
        "users": {
            "total": total_users,
            "premium": premium_users,
            "free": total_users - premium_users
        },
        "questions": {
            "total": total_questions,
            "today": questions_today
        }
    }

@router.get("/users")
async def get_users(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    _: UserInDB = Depends(get_admin_user)
):
    query = select(User).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    return users

@router.get("/questions")
async def get_questions(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    _: UserInDB = Depends(get_admin_user)
):
    query = select(Question).offset(skip).limit(limit)
    result = await db.execute(query)
    questions = result.scalars().all()
    return questions 