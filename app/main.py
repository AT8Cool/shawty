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

app = FastAPI()



@app.get("/")
def root():
    return()