# 📝 메모 앱 (Memo App)

**핸즈온 실습용 Next.js 메모 애플리케이션**

LocalStorage 기반의 완전한 CRUD 기능을 갖춘 메모 앱으로, MCP 연동 및 GitHub PR 생성 실습의 기반이 되는 프로젝트입니다.

## 🚀 주요 기능

- ✅ 메모 생성, 읽기, 수정, 삭제 (CRUD)
- 📂 카테고리별 메모 분류 (개인, 업무, 학습, 아이디어, 기타)
- 🏷️ 태그 시스템으로 메모 태깅
- 🔍 제목, 내용, 태그 기반 실시간 검색
- 🤖 **AI 메모 요약 (Google Gemini 2.0 Flash)**
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 💾 LocalStorage 기반 데이터 저장 (오프라인 지원)
- 🎨 모던한 UI/UX with Tailwind CSS

## 🛠 기술 스택

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Storage**: LocalStorage
- **AI**: Google Gemini 2.0 Flash (@google/genai)
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

AI 요약 기능을 사용하려면 Google Gemini API 키가 필요합니다:

1. `.env.example` 파일을 `.env.local`로 복사
2. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 발급
3. `.env.local` 파일에 API 키 입력:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 브라우저 접속

```
http://localhost:3000
```

## 📁 프로젝트 구조

```
memo-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── summarize/
│   │   │       └── route.ts     # AI 요약 API 엔드포인트
│   │   ├── globals.css          # 글로벌 스타일
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   └── page.tsx             # 메인 페이지
│   ├── components/
│   │   ├── MemoDetailModal.tsx  # 메모 상세보기 모달
│   │   ├── MemoForm.tsx         # 메모 생성/편집 폼
│   │   ├── MemoItem.tsx         # 개별 메모 카드
│   │   └── MemoList.tsx         # 메모 목록 및 필터
│   ├── hooks/
│   │   └── useMemos.ts          # 메모 관리 커스텀 훅
│   ├── types/
│   │   └── memo.ts              # 메모 타입 정의
│   └── utils/
│       ├── localStorage.ts      # LocalStorage 유틸리티
│       └── seedData.ts          # 샘플 데이터 시딩
├── .env.example                 # 환경 변수 예시
└── README.md                    # 프로젝트 문서
```

## 💡 주요 컴포넌트

### MemoDetailModal

- 메모 상세 내용 보기
- **AI 요약 기능** (Google Gemini 2.0 Flash 모델 사용)
- 마크다운 프리뷰 지원
- 편집/삭제 액션

### MemoItem

- 개별 메모를 카드 형태로 표시
- 편집/삭제 액션 버튼
- 카테고리 배지 및 태그 표시
- 날짜 포맷팅 및 텍스트 클램핑

### MemoForm

- 메모 생성/편집을 위한 모달 폼
- 제목, 내용, 카테고리, 태그 입력
- 태그 추가/제거 기능
- 폼 검증 및 에러 처리

### MemoList

- 메모 목록 그리드 표시
- 실시간 검색 및 카테고리 필터링
- 통계 정보 및 빈 상태 처리
- 반응형 그리드 레이아웃

## 🤖 AI 요약 기능

메모 상세보기에서 **요약 생성** 버튼을 클릭하면 Google Gemini 2.0 Flash 모델이 메모의 핵심 내용을 3-5개의 요점으로 자동 요약합니다.

### 특징

- ⚡ 빠른 응답 속도 (Gemini 2.0 Flash)
- 📝 한국어 최적화된 요약
- 🎯 핵심 내용 추출
- 🔄 요약 재생성 기능
- 🎨 시각적으로 구분되는 UI

## 📊 데이터 구조

```typescript
interface Memo {
  id: string // 고유 식별자
  title: string // 메모 제목
  content: string // 메모 내용
  category: string // 카테고리 (personal, work, study, idea, other)
  tags: string[] // 태그 배열
  createdAt: string // 생성 날짜 (ISO string)
  updatedAt: string // 수정 날짜 (ISO string)
}
```

## 🎯 실습 시나리오

이 프로젝트는 다음 3가지 실습의 기반으로 사용됩니다:

### 실습 1: Supabase MCP 마이그레이션 (45분)

- LocalStorage → Supabase 데이터베이스 전환
- MCP를 통한 자동 스키마 생성
- 기존 데이터 무손실 마이그레이션

### 실습 2: 기능 확장 + GitHub PR (60분)

- 메모 즐겨찾기 기능 추가
- Cursor Custom Modes로 PR 생성
- 코드 리뷰 및 협업 실습

### 실습 3: Playwright MCP 테스트 (45분)

- E2E 테스트 작성
- 브라우저 자동화 및 시각적 테스트
- 성능 측정 및 리포트

자세한 실습 가이드는 강의자료를 참고하세요.

## 🎨 샘플 데이터

앱 첫 실행 시 6개의 샘플 메모가 자동으로 생성됩니다:

- 프로젝트 회의 준비 (업무)
- React 18 새로운 기능 학습 (학습)
- 새로운 앱 아이디어: 습관 트래커 (아이디어)
- 주말 여행 계획 (개인)
- 독서 목록 (개인)
- 성능 최적화 아이디어 (아이디어)

## 🔧 개발 가이드

### 메모 CRUD 작업

```typescript
// useMemos 훅 사용 예시
const {
  memos, // 필터링된 메모 목록
  loading, // 로딩 상태
  createMemo, // 메모 생성
  updateMemo, // 메모 수정
  deleteMemo, // 메모 삭제
  searchMemos, // 검색
  filterByCategory, // 카테고리 필터링
  stats, // 통계 정보
} = useMemos()
```

### LocalStorage 직접 조작

```typescript
import { localStorageUtils } from '@/utils/localStorage'

// 모든 메모 가져오기
const memos = localStorageUtils.getMemos()

// 메모 추가
localStorageUtils.addMemo(newMemo)

// 메모 검색
const results = localStorageUtils.searchMemos('React')
```

## 🚀 배포

### Vercel 배포

```bash
npm run build
npx vercel --prod
```

### Netlify 배포

```bash
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭
```

## 📄 라이선스

MIT License - 학습 및 실습 목적으로 자유롭게 사용 가능합니다.

## 🤝 기여

이 프로젝트는 교육용으로 제작되었습니다. 개선사항이나 버그 리포트는 이슈나 PR로 제출해 주세요.

---

**Made with ❤️ for hands-on workshop**
