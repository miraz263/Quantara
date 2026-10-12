import sys
import os

# Ensure statistical engine is in sys.path
services_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../services/statistical-engine"))
if services_path not in sys.path:
    sys.path.insert(0, services_path)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db.session import engine, Base
from app.api.v1.api import api_router
from app.models import User, Project, Dataset, DatasetVersion, Variable, Analysis

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standardized Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": str(exc),
                "path": str(request.url.path)
            }
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router) # also support direct /health and /ready


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
