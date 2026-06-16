"""
URL Shortening Service

Business Logic Layer

Responsibilities:
- Generate short codes
- Validate URLs
- Create short links
- Calculate expiration times
- Retrieve original URLs
- Check expiration status

This is the heart of the application.
"""

import secrets
import string
from app.services.redis_client import redis_client
# from pydantic import BaseModel, HttpUrl, ValidationError

ALPHABET = string.ascii_letters + string.digits


redis_client.set("abc123", "https://google.com")

def key_exists(keke:str) -> bool:
  
    return bool(redis_client.exists(keke))


def generate_short_code() -> str:
    
    while True:
        keke = ""
        for _ in range(6):
            keke +=  secrets.choice(ALPHABET)
        if key_exists(keke) is False:
            return keke



def normalize_url(original_url:str)->str:
    if original_url.startswith('https') or original_url.startswith('http'):
        return original_url

    original_url = "https://" + original_url
    
    return original_url

def store_in_redis(short_code, n_url):
    redis_client.set(short_code,n_url,ex=86400)
    



def create_short_url(input_url:str):
    n_url = normalize_url(input_url)    
    short_code = generate_short_code()
    store_in_redis(short_code,n_url)

    return short_code
    

result = create_short_url("google.com")
print(result)
print(redis_client.get(result))




