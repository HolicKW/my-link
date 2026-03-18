# GEMINI.md - My Link (Linktree Clone for Developers)

이 문서는 Gemini CLI 에이전트가 프로젝트를 깊이 있게 이해하고 효율적으로 작업을 수행할 수 있도록 돕는 핵심 지침서입니다.

## 1. 프로젝트 개요 (Project Overview)
- **프로젝트 명:** 마이링크 (My Link)
- **목적:** 개발자와 크리에이터가 자신의 기술 스택, 프로젝트, 소셜 미디어를 하나의 세련된 페이지로 통합하여 브랜딩할 수 있는 커스텀 프로필 서비스.
- **주요 가치:** 단순한 링크 나열을 넘어 '디지털 명함'으로서의 가치 제공.
- **핵심 기술 스택:**
    - **Frontend:** Next.js 15+ (App Router), React 19, TypeScript
    - **Styling:** Tailwind CSS v4
    - **UI Library:** shadcn/ui
    - **Backend (BaaS):** Firebase (Authentication, Firestore, Storage)
    - **External APIs:** Google Favicon API, GitHub API

## 2. 프로젝트 구조 (Project Structure)
현재 프로젝트는 루트 디렉토리에서 바로 Next.js가 실행되는 구조입니다.
- `app/`: Next.js App Router 기반의 페이지 및 레이아웃 (`[slug]/page.tsx` 동적 라우팅 사용)
- `components/`: UI 컴포넌트 (sections: Hero, Contact, Skills 등 / ui: shadcn 기반 컴포넌트)
- `lib/`: Firebase 설정 및 공통 유틸리티 (슬러그 생성 등)
- `public/`: 정적 자산 (이미지, 로고 등)
- `docs/`: 프로젝트 기획 및 설계 문서
    - `mylink-prd.md`: 상세 기능 정의서 (PRD)

## 3. 빌드 및 실행 (Building and Running)
루트 디렉토리에서 실행합니다.

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 로컬 개발 서버를 시작합니다. |
| `npm run build` | 프로덕션을 위한 빌드를 수행합니다. |
| `npm run start` | 빌드된 프로덕션 서버를 실행합니다. |
| `npm run lint` | ESLint를 사용하여 코드 품질을 검사합니다. |

## 4. 개발 규칙 및 컨벤션 (Development Conventions)
- **인라인 편집 (Inline Editing):** 프로필 정보(닉네임, Bio 등)는 별도의 관리 페이지 없이 조회 화면에서 즉시 수정하는 UX를 지향합니다.
- **초기 데이터 설정:** 
    - 가입 시 지메일 아이디의 앞부분을 추출하여 `displayName`과 `slug`의 초기값으로 설정합니다.
    - `slug`는 항상 `displayName`과 동기화되어 사용자의 페이지 주소(`mylink.com/user123`)가 됩니다.
- **Firebase 데이터 모델링:**
    - `users` (Collection): 사용자 기본 정보 (`displayName`, `slug`, `photoURL`, `bio`, `techStack` 등)
    - `users/{uid}/links` (Sub-collection): 사용자의 개별 링크 데이터
- **낙관적 업데이트 (Optimistic Updates):** 사용자의 체감 속도를 높이기 위해 서버 저장 전 UI에 먼저 반영하는 패턴을 권장합니다.
- **반응형 디자인:** Mobile-First 전략을 기반으로 하며, Tailwind v4의 최신 유틸리티를 활용합니다.
- **자동 파비콘 연동:** Google Favicon API를 통해 URL 입력 시 자동으로 아이콘을 추출합니다.

## 5. 작업 시 주의사항
- **루트 디렉토리 작업:** 모든 작업은 루트 디렉토리(`.`)에서 수행합니다.
- **디자인 일관성:** 디자인 시스템은 `shadcn/ui`를 기반으로 하며, 모든 UI는 반응형으로 설계되어야 합니다.
- **Slug 동기화:** 닉네임 수정 시 URL 경로인 `slug`와 실시간으로 동기화되어야 함에 유의하십시오.