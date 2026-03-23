# GEMINI.md

이 파일은 마이링크(My Link) 프로젝트에 대한 개발 지침 및 컨텍스트를 제공합니다.

## 1. 프로젝트 개요
*   **프로젝트명:** 마이링크 (My Link)
*   **목적:** 개발자와 크리에이터가 자신의 기술 스택, 프로젝트, 소셜 미디어를 하나의 페이지로 통합하여 브랜딩할 수 있는 링크트리 클론 서비스.
*   **주요 기술 스택:**
    *   **Framework:** Next.js 15 (App Router)
    *   **Library:** React 19
    *   **Styling:** Tailwind CSS v4, shadcn/ui
    *   **Icons:** Lucide React
    *   **BaaS:** Firebase (Authentication, Firestore, Storage)
    *   **Language:** TypeScript

## 2. 프로젝트 구조
*   `app/`: Next.js App Router 기반의 페이지 및 레이아웃 정의.
*   `components/`: 재사용 가능한 UI 컴포넌트.
    *   `ui/`: shadcn/ui를 통해 추가된 기본 컴포넌트들.
*   `docs/`: PRD, 시나리오, 와이어프레임 등 프로젝트 문서.
*   `hooks/`: 커스텀 React 훅.
*   `lib/`: 유틸리티 함수 및 설정 파일.
*   `public/`: 정적 자산(이미지, 파비콘 등).

## 3. 빌드 및 실행 가이드
프로젝트를 로컬 환경에서 실행하고 검증하기 위한 주요 명령어입니다.

*   **개발 서버 실행:** `npm run dev` (Turbopack 사용)
*   **프로젝트 빌드:** `npm run build`
*   **프로덕션 서버 시작:** `npm run start`
*   **린트 체크:** `npm run lint`
*   **코드 포맷팅:** `npm run format` (Prettier)
*   **타입 체크:** `npm run typecheck`

## 4. 개발 컨벤션 및 지침
*   **UI 컴포넌트:** 새로운 UI 컴포넌트가 필요할 경우 `npx shadcn@latest add [component-name]` 명령어를 사용하여 `components/ui`에 추가하는 것을 우선으로 합니다.
*   **스타일링:** Tailwind CSS v4의 기능을 최대한 활용하며, 복잡한 클래스 조합은 `lib/utils.ts`의 `cn` 함수를 사용하여 관리합니다.
*   **데이터 모델링:** Firebase Firestore를 사용하며, 다음 구조를 따릅니다.
    *   `users` 컬렉션: 사용자 기본 프로필 정보.
    *   `users/{uid}/links` 서브 컬렉션: 사용자의 개별 링크 데이터.
*   **반응형 디자인:** 모바일 우선(Mobile-First) 접근 방식을 적용하여 모든 화면 크기에서 최적화된 뷰를 제공합니다.
*   **코드 스타일:** ESLint와 Prettier 설정을 준수하며, 커밋 전 `npm run format`과 `npm run lint`를 실행하여 코드 품질을 유지합니다.

## 5. 참고 문서
*   상세 기획 내용: `docs/prd.md`
*   사용자 시나리오: `docs/scenarios.md`
*   UI 와이어프레임: `docs/wireframes.md`

## 6. 참고
*  요구사항이 명확하거나 의문이 드는경우 사용자에게 질문을 통해 컨텍스트를 확보한 뒤 진행합니다.