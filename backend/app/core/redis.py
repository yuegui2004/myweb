from redis import asyncio as aioredis
from app.core.config import settings

redis = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
    socket_timeout=5,
)

class RedisKeys:
    """Redis键名常量"""
    @staticmethod
    def user_api_keys(user_id: int) -> str:
        return f"user:{user_id}:api_keys"
    
    @staticmethod
    def question_response(question_id: int) -> str:
        return f"question:{question_id}:response"
    
    @staticmethod
    def user_daily_count(user_id: int) -> str:
        return f"user:{user_id}:daily_count"

class RedisService:
    """Redis服务类"""
    @staticmethod
    async def cache_api_keys(user_id: int, api_keys: dict, expire: int = 86400):
        """缓存用户的API密钥"""
        key = RedisKeys.user_api_keys(user_id)
        await redis.hmset(key, api_keys)
        await redis.expire(key, expire)

    @staticmethod
    async def get_cached_api_keys(user_id: int) -> dict:
        """获取缓存的API密钥"""
        key = RedisKeys.user_api_keys(user_id)
        return await redis.hgetall(key)

    @staticmethod
    async def cache_question_response(question_id: int, response: dict, expire: int = 3600):
        """缓存问题的响应"""
        key = RedisKeys.question_response(question_id)
        await redis.set(key, str(response), ex=expire)

    @staticmethod
    async def get_cached_question_response(question_id: int) -> dict:
        """获取缓存的问题响应"""
        key = RedisKeys.question_response(question_id)
        cached = await redis.get(key)
        return eval(cached) if cached else None

    @staticmethod
    async def increment_daily_count(user_id: int) -> int:
        """增加用户每日使用次数"""
        key = RedisKeys.user_daily_count(user_id)
        count = await redis.incr(key)
        if count == 1:  # 第一次增加时设置过期时间（次日凌晨）
            import datetime
            now = datetime.datetime.now()
            tomorrow = now + datetime.timedelta(days=1)
            tomorrow = tomorrow.replace(hour=0, minute=0, second=0)
            expire_seconds = int((tomorrow - now).total_seconds())
            await redis.expire(key, expire_seconds)
        return count

    @staticmethod
    async def get_daily_count(user_id: int) -> int:
        """获取用户当日使用次数"""
        key = RedisKeys.user_daily_count(user_id)
        count = await redis.get(key)
        return int(count) if count else 0 