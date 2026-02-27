import uuid

import stripe
from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.config import settings
from app.database import db
from app.schemas import CheckoutResponse, SubscriptionResponse

router = APIRouter(tags=["payments"])

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(user_id: uuid.UUID = Depends(get_current_user)) -> CheckoutResponse:
    """Create a Stripe Checkout session for subscription."""

    if settings.mock_stripe:
        return CheckoutResponse(checkout_url=f"{settings.app_url}/dashboard?mock_payment=true")

    # Check if user already has active subscription
    sub = await db.select("subscriptions", filters={"user_id": str(user_id)}, single=True)
    if sub and sub["status"] == "ACTIVE":
        raise HTTPException(status_code=400, detail="Already subscribed")

    try:
        session = stripe.checkout.Session.create(
            mode="subscription",
            payment_method_types=["card"],
            line_items=[
                {
                    "price": settings.stripe_price_id,
                    "quantity": 1,
                }
            ],
            metadata={"user_id": str(user_id)},
            success_url=f"{settings.app_url}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.app_url}/dashboard",
        )
    except stripe.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {e}")

    return CheckoutResponse(checkout_url=session.url)


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(user_id: uuid.UUID = Depends(get_current_user)) -> SubscriptionResponse:
    """Get current subscription status."""

    sub = await db.select("subscriptions", filters={"user_id": str(user_id)}, single=True)

    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")

    return SubscriptionResponse(
        status=sub["status"],
        current_period_end=sub.get("current_period_end"),
    )
