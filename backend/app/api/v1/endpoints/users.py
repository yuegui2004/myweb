from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.user import UserInDB
from app.crud.crud_user import user_crud
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

class ApiKeys(BaseModel):
    openai: str = ""
    google: str = ""
    moonshot: str = ""
    baidu: str = ""

@router.get("/api-keys")
async def get_api_keys(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取用户的API密钥设置"""
    user = await user_crud.get(db, current_user.id)
    return {
        "openai": user.openai_api_key or "",
        "google": user.google_api_key or "",
        "moonshot": user.moonshot_api_key or "",
        "baidu": user.baidu_access_token or ""
    }

@router.post("/api-keys")
async def update_api_keys(
    api_keys: ApiKeys,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新用户的API密钥设置"""
    try:
        user = await user_crud.get(db, current_user.id)
        user.openai_api_key = api_keys.openai
        user.google_api_key = api_keys.google
        user.moonshot_api_key = api_keys.moonshot
        user.baidu_access_token = api_keys.baidu
        await db.commit()
        return {"message": "API密钥更新成功"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 