from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # Stripe
    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_price_id: str = ""  # Your subscription price ID

    # Security
    encryption_key: str = ""  # Fernet key for encrypting sensitive data

    # App URLs
    api_url: str = "http://localhost:8000"
    app_url: str = "http://localhost:3000"

    # Mock Mode (local dev)
    mock_stripe: bool = False

    # Dev Mode
    dev_user_id: str = ""  # Set to bypass auth for testing

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
