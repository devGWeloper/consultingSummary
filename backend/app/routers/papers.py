from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
import os
import re

from ..database import get_db
from ..models import Paper
from ..schemas import (
    PaperCreate,
    PaperResponse,
    PaperListResponse,
    PaperStats,
    FilterOptions,
    ScanResult,
)

router = APIRouter(prefix="/api/papers", tags=["papers"])

# 저장 경로 설정
STORAGE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "storage",
    "papers"
)


@router.get("", response_model=List[PaperListResponse])
def get_papers(
    year: Optional[int] = None,
    topic: Optional[str] = None,
    company: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Paper 목록 조회 (필터 지원)"""
    query = db.query(Paper)

    if year:
        query = query.filter(Paper.year == year)
    if topic:
        query = query.filter(Paper.topic == topic)
    if company:
        query = query.filter(Paper.company == company)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Paper.title.ilike(search_term))
            | (Paper.summary.ilike(search_term))
            | (Paper.content.ilike(search_term))
        )

    papers = query.order_by(Paper.created_at.desc()).all()
    return papers


@router.get("/filters", response_model=FilterOptions)
def get_filter_options(db: Session = Depends(get_db)):
    """필터 옵션 조회 (연도, 주제, 회사 목록)"""
    years = db.query(Paper.year).distinct().order_by(Paper.year.desc()).all()
    topics = db.query(Paper.topic).distinct().order_by(Paper.topic).all()
    companies = db.query(Paper.company).distinct().order_by(Paper.company).all()

    return FilterOptions(
        years=[y[0] for y in years],
        topics=[t[0] for t in topics],
        companies=[c[0] for c in companies],
    )


@router.get("/stats", response_model=PaperStats)
def get_stats(db: Session = Depends(get_db)):
    """통계 조회"""
    total = db.query(func.count(Paper.id)).scalar()

    # 연도별 통계
    by_year_query = (
        db.query(Paper.year, func.count(Paper.id))
        .group_by(Paper.year)
        .order_by(Paper.year.desc())
        .all()
    )
    by_year = {str(year): count for year, count in by_year_query}

    # 주제별 통계
    by_topic_query = (
        db.query(Paper.topic, func.count(Paper.id))
        .group_by(Paper.topic)
        .order_by(func.count(Paper.id).desc())
        .all()
    )
    by_topic = {topic: count for topic, count in by_topic_query}

    # 회사별 통계
    by_company_query = (
        db.query(Paper.company, func.count(Paper.id))
        .group_by(Paper.company)
        .order_by(func.count(Paper.id).desc())
        .all()
    )
    by_company = {company: count for company, count in by_company_query}

    return PaperStats(
        total_papers=total or 0,
        by_year=by_year,
        by_topic=by_topic,
        by_company=by_company,
    )


@router.get("/{paper_id}", response_model=PaperResponse)
def get_paper(paper_id: int, db: Session = Depends(get_db)):
    """Paper 상세 조회"""
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


@router.post("/upload", response_model=PaperResponse)
async def upload_paper(
    file: UploadFile = File(...),
    title: str = Form(...),
    company: str = Form(...),
    year: int = Form(...),
    topic: str = Form(...),
    summary: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """마크다운 파일 업로드"""
    # 파일 확장자 검증
    if not file.filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Only .md files are allowed")

    # 파일 내용 읽기
    content = await file.read()
    content_str = content.decode("utf-8")

    # 저장 경로 생성
    year_path = os.path.join(STORAGE_PATH, str(year), topic)
    os.makedirs(year_path, exist_ok=True)

    # 파일 저장
    file_path = os.path.join(year_path, file.filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_str)

    # 상대 경로 저장
    relative_path = os.path.join(str(year), topic, file.filename)

    # 요약 자동 생성 (첫 번째 문단 추출)
    if not summary:
        summary = extract_summary(content_str)

    # DB 저장
    paper = Paper(
        title=title,
        company=company,
        year=year,
        topic=topic,
        summary=summary,
        content=content_str,
        file_path=relative_path,
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)

    return paper


@router.post("/scan", response_model=ScanResult)
def scan_folder(db: Session = Depends(get_db)):
    """storage/papers 폴더 스캔하여 DB에 추가"""
    added = 0
    updated = 0
    errors = []

    if not os.path.exists(STORAGE_PATH):
        return ScanResult(added=0, updated=0, errors=["Storage folder not found"])

    # 폴더 구조: storage/papers/{year}/{topic}/{filename}.md
    for year_dir in os.listdir(STORAGE_PATH):
        year_path = os.path.join(STORAGE_PATH, year_dir)
        if not os.path.isdir(year_path):
            continue

        try:
            year = int(year_dir)
        except ValueError:
            errors.append(f"Invalid year folder: {year_dir}")
            continue

        for topic_dir in os.listdir(year_path):
            topic_path = os.path.join(year_path, topic_dir)
            if not os.path.isdir(topic_path):
                continue

            topic = topic_dir

            for filename in os.listdir(topic_path):
                if not filename.endswith(".md"):
                    continue

                file_path = os.path.join(topic_path, filename)
                relative_path = os.path.join(str(year), topic, filename)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    # 제목 추출 (첫 번째 # 헤더 또는 파일명)
                    title = extract_title(content, filename)
                    
                    # 회사명 추출 (파일명에서 추출 시도)
                    company = extract_company(filename, content)
                    
                    # 요약 추출
                    summary = extract_summary(content)

                    # 기존 항목 확인 (file_path로 중복 체크)
                    existing = (
                        db.query(Paper)
                        .filter(Paper.file_path == relative_path)
                        .first()
                    )

                    if existing:
                        # 업데이트
                        existing.title = title
                        existing.company = company
                        existing.year = year
                        existing.topic = topic
                        existing.summary = summary
                        existing.content = content
                        updated += 1
                    else:
                        # 새로 추가
                        paper = Paper(
                            title=title,
                            company=company,
                            year=year,
                            topic=topic,
                            summary=summary,
                            content=content,
                            file_path=relative_path,
                        )
                        db.add(paper)
                        added += 1

                except Exception as e:
                    errors.append(f"Error processing {relative_path}: {str(e)}")

    db.commit()
    return ScanResult(added=added, updated=updated, errors=errors)


@router.delete("/{paper_id}")
def delete_paper(paper_id: int, db: Session = Depends(get_db)):
    """Paper 삭제"""
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # 파일도 삭제 (선택적)
    if paper.file_path:
        full_path = os.path.join(STORAGE_PATH, paper.file_path)
        if os.path.exists(full_path):
            os.remove(full_path)

    db.delete(paper)
    db.commit()
    return {"message": "Paper deleted successfully"}


def extract_title(content: str, filename: str) -> str:
    """마크다운에서 제목 추출"""
    # # 으로 시작하는 첫 번째 헤더 찾기
    match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    
    # 파일명에서 추출 (확장자 제거)
    return filename.replace(".md", "").replace("-", " ").title()


def extract_company(filename: str, content: str) -> str:
    """파일명 또는 내용에서 회사명 추출"""
    # 알려진 컨설팅 회사 패턴
    companies = ["mckinsey", "bcg", "bain", "deloitte", "pwc", "ey", "kpmg", "accenture"]
    
    filename_lower = filename.lower()
    for company in companies:
        if company in filename_lower:
            return company.upper() if len(company) <= 4 else company.capitalize()
    
    # 내용에서 찾기
    content_lower = content.lower()
    for company in companies:
        if company in content_lower:
            return company.upper() if len(company) <= 4 else company.capitalize()
    
    return "Unknown"


def extract_summary(content: str) -> str:
    """마크다운에서 요약 추출 (첫 번째 의미있는 문단)"""
    lines = content.split("\n")
    summary_lines = []
    
    for line in lines:
        line = line.strip()
        # 헤더 건너뛰기
        if line.startswith("#") or not line:
            continue
        # 메타데이터 건너뛰기
        if line.startswith("---") or line.startswith("*출처"):
            continue
        # 일반 텍스트 찾으면 추가
        if len(line) > 20:
            summary_lines.append(line)
            if len(" ".join(summary_lines)) > 200:
                break
    
    summary = " ".join(summary_lines)
    if len(summary) > 300:
        summary = summary[:297] + "..."
    
    return summary or "요약 없음"
