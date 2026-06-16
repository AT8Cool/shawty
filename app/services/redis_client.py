"""
Responsibility:
Create a connection to Redis
Export it for the rest of the app
"""
import redis


redis_client = redis.Redis(
    host = "localhost",
    port = 6379,
    decode_responses= True
)


print(redis_client.ping())