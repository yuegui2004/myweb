from sqlalchemy import Boolean, Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    question_count = Column(Integer, default=0)
    subscription_type = Column(String, default="free")
    
    # API密钥字段
    openai_api_key = Column(String, nullable=True)
    google_api_key = Column(String, nullable=True)
    moonshot_api_key = Column(String, nullable=True)
    baidu_access_token = Column(String, nullable=True)