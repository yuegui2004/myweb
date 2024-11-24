from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Compare Platform"
    
    # PostgreSQL配置
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str  # 数据库主机地址
    POSTGRES_PORT: str = "5432"  # 默认端口
    POSTGRES_DB: str
    
    # 构建异步数据库URL
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis配置
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT设置
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # 其他配置...
    
    class Config:
        env_file = ".env"

settings = Settings() 