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


def key_exists(keke: str) -> bool:
    """
    Checks whether a short code already exists in Redis.

    Args:
        short_code: The generated short code to check.

    Returns:
        True if the short code exists, otherwise False.
    """
    return bool(redis_client.exists(keke))


def generate_short_code() -> str:
    """
    Generates a unique 6-character short code.

    Returns:
        A unique Base62 short code that is not already
        present in Redis.
    """

    while True:
        keke = ""
        for _ in range(6):
            keke += secrets.choice(ALPHABET)
        if key_exists(keke) is False:
            return keke


def normalize_url(original_url: str) -> str:
    """
    Normalizes a URL by ensuring it contains a protocol.

    Args:
        original_url: The URL submitted by the user.

    Returns:
        A normalized URL beginning with http:// or https://.
    """
    if original_url.startswith("https") or original_url.startswith("http"):
        return original_url

    original_url = "https://" + original_url

    return original_url


def store_in_redis(short_code: str, n_url: str) -> str | None:
    """
    Stores a short code and URL mapping in Redis.

    Args:
        short_code: The generated short code.
        url: The normalized destination URL.

    Returns:
        None
    """
    redis_client.set(short_code, n_url, ex=86400)


def create_short_url(input_url: str) -> str:
    """
    Creates a short URL entry and stores it in Redis.

    Workflow:
        1. Normalize the input URL.
        2. Generate a unique short code.
        3. Store the mapping in Redis with a TTL.

    Args:
        input_url: The original URL submitted by the user.

    Returns:
        The generated short code.
    """
    n_url = normalize_url(input_url)
    short_code = generate_short_code()
    store_in_redis(short_code, n_url)

    return short_code


def get_original_url(short_code: str) -> str | None:
    """
    Retrieves the original URL associated with a short code.

    Args:
        short_code: The short code supplied by the user.

    Returns:
        The original URL if found, otherwise None.
    """
    return redis_client.get(short_code)
