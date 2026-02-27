import logging

import stripe
from fastapi import APIRouter, HTTPException, Request, Response

from app.config import settings
from app.database import db

logger = logging.getLogger("app.webhooks")

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

stripe.api_key = settings.stripe_secret_key


@router.post("/stripe")
async def stripe_webhook(request: Request) -> dict:
    """Handle Stripe webhook events."""
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")

    if settings.mock_stripe:
        return {"status": "ok", "mock": True}

    try:
        event = stripe.Webhook.construct_event(
            body, sig, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.SignatureVerificationError) as e:
        logger.error(f"Stripe signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data = event["data"]["object"]
    logger.info(f"Stripe event: {event_type}")

    if event_type == "checkout.session.completed":
        user_id = data.get("metadata", {}).get("user_id")
        if not user_id:
            logger.error("No user_id in checkout metadata")
            return {"status": "error", "reason": "no user_id"}

        # Create subscription record
        await db.upsert(
            "subscriptions",
            {
                "user_id": user_id,
                "stripe_customer_id": data.get("customer", ""),
                "stripe_subscription_id": data.get("subscription", ""),
                "status": "ACTIVE",
            },
            on_conflict="user_id",
        )
        logger.info(f"Subscription created for user {user_id}")

    elif event_type == "invoice.payment_succeeded":
        sub_id = data.get("subscription")
        if sub_id:
            rows = await db.select(
                "subscriptions", filters={"stripe_subscription_id": sub_id}
            )
            if rows:
                await db.update(
                    "subscriptions",
                    {"status": "ACTIVE", "updated_at": "now()"},
                    {"stripe_subscription_id": sub_id},
                )

    elif event_type == "invoice.payment_failed":
        sub_id = data.get("subscription")
        if sub_id:
            await db.update(
                "subscriptions",
                {"status": "PAST_DUE", "updated_at": "now()"},
                {"stripe_subscription_id": sub_id},
            )

    elif event_type == "customer.subscription.deleted":
        sub_id = data.get("id")
        if sub_id:
            await db.update(
                "subscriptions",
                {"status": "CANCELED", "updated_at": "now()"},
                {"stripe_subscription_id": sub_id},
            )

    return {"status": "ok"}
