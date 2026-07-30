from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the absolute path to the backend directory (where .env lives)
# app/core/config.py -> app/core -> app -> backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    APP_NAME: str = "StudyMate AI"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GEMINI_API_KEY: str

    GROQ_API_KEY: str

    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "studymate_documents"

    # Direct Pydantic to the exact path of your .env file
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()