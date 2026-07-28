from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    DEBUG: bool

    API_V1_PREFIX: str

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GEMINI_API_KEY: str = ""

    QDRANT_URL: str
    QDRANT_COLLECTION: str

    class Config:
        env_file = ".env"


settings = Settings()