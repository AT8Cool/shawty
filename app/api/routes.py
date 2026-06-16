"""
API Layer

Responsibilities:
- Define HTTP endpoints
- Receive requests from clients
- Validate incoming data using schemas
- Call service layer functions
- Return HTTP responses

Endpoints:
- POST /shorten
- GET /{short_code}

Should NOT contain:
- Database logic
- Short code generation logic
- Business rules
"""
from fastapi import APIRouter
from app.services.shortener import create_short_url
from app.schemas.url import ShortenRequest,ShortenResponse



router = APIRouter()


@router.post('/shorten')
async def shorten(url:ShortenRequest)-> ShortenResponse:


    short_code = create_short_url(url.url)
    res = ShortenResponse(short_code=short_code)
    

    return res




