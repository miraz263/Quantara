import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Quantara AI-Native Quantitative Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "quantara_secret_key_development_3f9a3914")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database: SQLite fallback for instant zero-dependency local dev, PostgreSQL for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/quantara.db")
    
    # Upload storage directory
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "/tmp/quantara_storage")

    class Config:
        case_sensitive = True


settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)
