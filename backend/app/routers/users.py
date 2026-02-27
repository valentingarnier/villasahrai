import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.config import settings
from app.database import db
from app.schemas import UserProfile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfile)
async def get_me(user_id: uuid.UUID = Depends(get_current_user)) -> UserProfile:
    """Get current user profile with subscription status."""

    # Get subscription status
    sub_row = await db.select("subscriptions", filters={"user_id": str(user_id)}, single=True)
    subscription_status = sub_row["status"] if sub_row else None

    # Get user email from Supabase auth
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.supabase_url}/auth/v1/admin/users/{user_id}",
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
            },
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch user info")
        user_data = resp.json()
        email = user_data.get("email", "")

    return UserProfile(
        id=user_id,
        email=email,
        subscription_status=subscription_status,
    )
