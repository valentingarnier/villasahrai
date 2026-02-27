from fastapi import APIRouter

router = APIRouter(tags=["hello"])


@router.get("/hello")
async def hello() -> dict:
    """Simple hello endpoint to verify the API is working."""
    return {"message": "Hello from the API! Everything is connected."}
