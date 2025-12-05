from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class PaperBase(BaseModel):
    """Paper 기본 스키마"""
    title: str
    company: str
    year: int
    topic: str
    summary: Optional[str] = None


class PaperCreate(PaperBase):
    """Paper 생성 스키마"""
    content: str


class PaperResponse(PaperBase):
    """Paper 응답 스키마"""
    id: int
    content: str
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaperListResponse(PaperBase):
    """Paper 목록 응답 스키마 (content 제외)"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaperStats(BaseModel):
    """통계 응답 스키마"""
    total_papers: int
    by_year: dict
    by_topic: dict
    by_company: dict


class FilterOptions(BaseModel):
    """필터 옵션 응답 스키마"""
    years: List[int]
    topics: List[str]
    companies: List[str]


class ScanResult(BaseModel):
    """폴더 스캔 결과 스키마"""
    added: int
    updated: int
    errors: List[str]

