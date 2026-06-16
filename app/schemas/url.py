"""
Request and Response Schemas

Responsibilities:
- Define request structure
- Define response structure
- Validate incoming data

Examples:

Create URL Request:
{
    "url": "https://google.com"
}

Create URL Response:
{
    "short_url": "https://short.ly/abc123"
}
"""

from pydantic import BaseModel


class ShortenRequest(BaseModel):
    url : str


class ShortenResponse(BaseModel):
    short_code :str