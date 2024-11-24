from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    
    # AI响应
    chatgpt_response = Column(JSON, nullable=True)
    gemini_response = Column(JSON, nullable=True)
    kimi_response = Column(JSON, nullable=True)
    ernie_response = Column(JSON, nullable=True)
    
    # 元数据
    total_tokens = Column(Integer, default=0)
    processing_time = Column(Float)  # 处理时间（秒）
    status = Column(String, default="completed")  # completed, failed, processing
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    user = relationship("User", back_populates="questions") 