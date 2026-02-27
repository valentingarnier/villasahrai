import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import HealthResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("app")

app = FastAPI(
    title="My SaaS API",
    version="0.1.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# Build CORS origins list (include www variants automatically)
app_url = settings.app_url.rstrip("/")

cors_origins = [
    app_url,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

# Add www variants if the URL is a production domain
if app_url.startswith("https://") and not app_url.startswith("https://www."):
    cors_origins.append(app_url.replace("https://", "https://www."))
elif app_url.startswith("https://www."):
    cors_origins.append(app_url.replace("https://www.", "https://"))

logger.info(f"CORS allowed origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", version="0.1.0")


# Register routers
from app.routers import checkout, hello, users, webhooks

app.include_router(hello.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(checkout.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")
