from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
)

app.include_router(chat_router)

# CORS — allows React (port 5173) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(documents_router)

@app.get("/")
def root():
    return {"message": "Welcome to StudyMate AI 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}