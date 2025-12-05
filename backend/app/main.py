from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .routers import papers

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 저장 폴더 생성
STORAGE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage", "papers")
os.makedirs(STORAGE_PATH, exist_ok=True)

app = FastAPI(
    title="White Paper Summary API",
    description="컨설팅 회사 White Paper 요약 관리 API",
    version="1.0.0"
)

# CORS 설정 (프론트엔드 연동용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(papers.router)


@app.get("/")
def root():
    """API 루트"""
    return {
        "message": "White Paper Summary API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """헬스 체크"""
    return {"status": "healthy"}

