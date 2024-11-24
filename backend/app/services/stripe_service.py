import stripe
from app.core.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud_user import user_crud

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    async def create_checkout_session(self, customer_email: str, plan_id: str):
        price_id = self._get_price_id(plan_id)
        
        checkout_session = stripe.checkout.Session.create(
            customer_email=customer_email,
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'{settings.FRONTEND_URL}/subscription/success',
            cancel_url=f'{settings.FRONTEND_URL}/subscription/cancel',
        )
        return checkout_session

    async def handle_webhook(self, payload: dict, db: AsyncSession):
        event = stripe.Event.construct_from(payload, stripe.api_key)

        if event.type == 'checkout.session.completed':
            session = event.data.object
            await self._handle_successful_subscription(session, db)
        elif event.type == 'customer.subscription.deleted':
            subscription = event.data.object
            await self._handle_cancelled_subscription(subscription, db)

    async def _handle_successful_subscription(self, session: dict, db: AsyncSession):
        customer_email = session.customer_email
        user = await user_crud.get_by_email(db, email=customer_email)
        if user:
            user.subscription_type = 'premium'
            await db.commit()

    async def _handle_cancelled_subscription(self, subscription: dict, db: AsyncSession):
        customer = await stripe.Customer.retrieve(subscription.customer)
        user = await user_crud.get_by_email(db, email=customer.email)
        if user:
            user.subscription_type = 'free'
            await db.commit()

    def _get_price_id(self, plan_id: str) -> str:
        price_mapping = {
            'monthly': settings.STRIPE_MONTHLY_PRICE_ID,
            'yearly': settings.STRIPE_YEARLY_PRICE_ID,
        }
        return price_mapping.get(plan_id) 