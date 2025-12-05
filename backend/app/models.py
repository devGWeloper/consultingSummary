from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class Paper(Base):
    """White Paper 요약 모델"""
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    topic = Column(String(100), nullable=False, index=True)
    summary = Column(Text, nullable=True)  # 요약 미리보기
    content = Column(Text, nullable=False)  # MD 전체 내용
    file_path = Column(String(500), nullable=True)  # 파일 경로 (폴더 스캔 시)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Paper {self.title} ({self.company}, {self.year})>"

