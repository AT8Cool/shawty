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
from app.services.shortener import create_short_url

app = FastAPI()




@app.get("/")
def root():
    return("Hello I'm alive")


@app.post('/shorten')
async def shorten(url:str)-> str:
    
    return create_short_url(url)
    
