from typing import Optional
import json
from redis import asyncio as aioredis
from app.core.config import settings

redis = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)

class RedisCache:
    @staticmethod
    async def get(key: str) -> Optional[str]:
        return await redis.get(key)

    @staticmethod
    async def set(key: str, value: str, expire: int = 3600):
        await redis.set(key, value, ex=expire)

    @staticmethod
    async def delete(key: str):
        await redis.delete(key)

    @staticmethod
    async def cache_response(key: str, response: dict, expire: int = 3600):
        await redis.set(key, json.dumps(response), ex=expire)

    @staticmethod
    async def get_cached_response(key: str) -> Optional[dict]:
        cached = await redis.get(key)
        return json.loads(cached) if cached else None 