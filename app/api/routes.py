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
from fastapi import APIRouter, HTTPException
from app.services.shortener import create_short_url, get_original_url
from app.schemas.url import ShortenRequest,ShortenResponse
from fastapi.responses import RedirectResponse


router = APIRouter()


@router.post('/shorten')
async def shorten(url:ShortenRequest)-> ShortenResponse:
    short_code = create_short_url(url.url)
    res = ShortenResponse(short_code=short_code)
    return res


@router.get("/{short_code}")
async def redirect(short_code:str):

    original_url = get_original_url(short_code)
    if original_url is None:

        raise HTTPException(
            status_code=404,
            detail="Invalid or expired URL"
        )
        
    return RedirectResponse(url = original_url)



    





