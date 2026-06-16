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
from redis import Redis
import httpx
import json

from app.api.routes import router


app = FastAPI()

@app.get("/")
def root():
    return("Hello I'm alive")


app.include_router(router)





    
