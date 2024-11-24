from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.schemas.user import UserInDB
from app.services.stripe_service import StripeService
from app.crud.crud_user import user_crud

router = APIRouter()
stripe_service = StripeService()

@router.post("/create-checkout")
async def create_checkout_session(
    plan_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        checkout_session = await stripe_service.create_checkout_session(
            customer_email=current_user.email,
            plan_id=plan_id
        )
        return {"checkoutUrl": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(
    payload: dict,
    db: AsyncSession = Depends(get_db)
):
    try:
        await stripe_service.handle_webhook(payload, db)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 