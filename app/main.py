"""
Application Entry Point

Responsibilities:
- Create FastAPI application instance
- Register API routes
- Configure startup/shutdown events
- Start the web server

Should NOT contain:
- Business logic
- Database queries
- URL shortening logic
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],

)


@app.get("/")
def root():
    return "Hello I'm alive"


app.include_router(router)
