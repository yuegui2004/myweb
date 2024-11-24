import httpx
import asyncio
from app.core.config import settings
from app.core.cache import RedisCache
import hashlib
from typing import Dict, Any
from datetime import datetime
from app.models.user import User

class AIService:
    def __init__(self):
        self.cache = RedisCache()

    async def get_chatgpt_response(self, question: str, user: User) -> Dict[str, Any]:
        """调用ChatGPT API并返回完整的响应"""
        if not user.openai_api_key:
            return {"error": "请先配置OpenAI API密钥"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {user.openai_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-4",  # 或其他模型
                        "messages": [{"role": "user", "content": question}],
                        "temperature": 0.7,
                        "max_tokens": 1000
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "usage": data["usage"],
                    "model": data["model"],
                    "created": data["created"]
                }
            except httpx.HTTPError as e:
                print(f"HTTP error occurred: {e}")
                return {"error": str(e)}
            except Exception as e:
                print(f"Error occurred: {e}")
                return {"error": "An unexpected error occurred"}

    async def get_gemini_response(self, question: str, user: User) -> Dict[str, Any]:
        """调用Gemini API并返回完整的响应"""
        if not user.google_api_key:
            return {"error": "请先配置Google API密钥"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={user.google_api_key}",
                    headers={
                        "Content-Type": "application/json"
                    },
                    json={
                        "contents": [{
                            "parts": [{"text": question}]
                        }]
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                # 提取响应内容
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                safety_ratings = data["candidates"][0]["safetyRatings"]
                
                return {
                    "content": content,
                    "model": "gemini-1.5-flash",
                    "safety_ratings": safety_ratings,
                    "finish_reason": data["candidates"][0]["finishReason"],
                    "created": int(datetime.now().timestamp())  # 添加时间戳
                }
            except httpx.HTTPError as e:
                print(f"HTTP error occurred: {e}")
                return {"error": str(e)}
            except Exception as e:
                print(f"Error occurred: {e}")
                return {"error": "An unexpected error occurred"}

    async def get_kimi_response(self, question: str, user: User) -> Dict[str, Any]:
        """调用Kimi API并返回完整的响应"""
        if not user.moonshot_api_key:
            return {"error": "请先配置Moonshot API密钥"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.moonshot.cn/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {user.moonshot_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "moonshot-v1-8k",
                        "messages": [
                            {
                                "role": "system",
                                "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。"
                            },
                            {
                                "role": "user",
                                "content": question
                            }
                        ],
                        "temperature": 0.3
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": data["model"],
                    "usage": data["usage"],
                    "created": data["created"],
                    "finish_reason": data["choices"][0]["finish_reason"],
                    "id": data["id"]
                }
            except httpx.HTTPError as e:
                print(f"HTTP error occurred: {e}")
                return {"error": str(e)}
            except Exception as e:
                print(f"Error occurred: {e}")
                return {"error": "An unexpected error occurred"}

    async def get_ernie_response(self, question: str, user: User) -> Dict[str, Any]:
        """调用百度文心一言API并返回完整的响应"""
        if not user.baidu_access_token:
            return {"error": "请先配置百度文心一言Access Token"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://qianfan.baidubce.com/v2/chat/completions",
                    headers={
                        "Authorization": f"Bearer {user.baidu_access_token}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "ernie-3.5-8k",
                        "messages": [
                            {
                                "role": "system",
                                "content": "你是由百度开发的AI助手文心一言"
                            },
                            {
                                "role": "user",
                                "content": question
                            }
                        ]
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "model": data["model"],
                    "usage": data["usage"],
                    "created": data["created"],
                    "finish_reason": data["choices"][0]["finish_reason"],
                    "id": data["id"],
                    "flag": data["choices"][0]["flag"]
                }
            except httpx.HTTPError as e:
                print(f"HTTP error occurred: {e}")
                return {"error": str(e)}
            except Exception as e:
                print(f"Error occurred: {e}")
                return {"error": "An unexpected error occurred"}

    async def get_all_responses(self, question: str):
        """获取所有AI模型的响应"""
        cache_key = self._generate_cache_key(question)
        
        # 尝试从缓存获取
        cached_response = await self.cache.get_cached_response(cache_key)
        if cached_response:
            return cached_response

        # 调用AI API
        responses = await self._fetch_ai_responses(question)
        
        # 缓存结果
        await self.cache.cache_response(cache_key, responses)
        
        return responses

    async def _fetch_ai_responses(self, question: str):
        """并行获取所有AI响应"""
        tasks = [
            self.get_chatgpt_response(question),
            self.get_gemini_response(question),
            self.get_kimi_response(question),
            self.get_ernie_response(question),
        ]
        
        responses = await asyncio.gather(*tasks)
        
        return {
            "chatgpt": responses[0],
            "gemini": responses[1],
            "kimi": responses[2],
            "ernie": responses[3],
        }

    def _generate_cache_key(self, question: str) -> str:
        return f"ai_response:{hashlib.md5(question.encode()).hexdigest()}"

    # ... 其他AI API调用方法 ... 