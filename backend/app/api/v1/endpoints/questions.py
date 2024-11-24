from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.user import UserInDB
from app.services.ai_service import AIService
from app.models.question import Question

router = APIRouter()
ai_service = AIService()

@router.post("/")
async def create_question(
    content: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 检查用户是否超过每日限额
    if current_user.subscription_type == "free" and current_user.question_count >= 5:
        raise HTTPException(
            status_code=403,
            detail="You have reached your daily question limit. Please upgrade to premium."
        )

    # 获取AI回答
    responses = await ai_service.get_all_responses(content)

    # 创建问题记录
    question = Question(
        user_id=current_user.id,
        content=content,
        copilot_response=responses.get("copilot"),
        chatgpt_response=responses.get("chatgpt"),
        gemini_response=responses.get("gemini"),
        meta_ai_response=responses.get("meta_ai")
    )
    
    db.add(question)
    await db.commit()
    await db.refresh(question)

    return {"responses": responses} 