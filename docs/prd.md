# [PRD] 링크트리 클론 서비스: 마이링크 (My Link) - ver 0.2

## 1. 프로젝트 개요
*   **프로젝트명:** 마이링크 (My Link)
*   **목적:** 개발자와 크리에이터가 자신의 기술 스택, 프로젝트, 소셜 미디어를 하나의 세련된 페이지로 통합하여 브랜딩할 수 있는 커스텀 프로필 서비스.
*   **대상 사용자:** 
    *   **Main:** 오픈소스 기여도와 개인 프로젝트를 홍보하고 싶은 개발자.
    *   **Sub:** 유튜브, 치지직, 인스타그램 등 멀티 채널을 운영하는 크리에이터.
    *   **Goal:** 단순 링크 나열을 넘어 '디지털 명함'으로서의 가치 제공.

---

## 2. 핵심 기능 목록

| 우선순위 | 구분 | 기능명 | 설명 |
| :--- | :--- | :--- | :--- |
| **P0** | 필수 | **구글 소셜 로그인** | Firebase Auth를 이용한 간편한 구글 계정 연동 및 가입. |
| **P0** | 필수 | **멀티 링크 관리** | 무제한 링크 추가, 수정, 삭제 기능 (생성 역순 혹은 정적 리스트 노출). |
| P0 | 필수 | 파비콘 자동 연동 | URL 입력 시 해당 사이트의 파비콘을 링크 아이콘으로 자동 설정. |
| **P0** | 필수 | **프로필 커스텀** | 프로필 이미지, 닉네임, 전문 분야(Tech Stack) 설정. |
| **P0** | 필수 | **모바일 최적화 뷰어** | 다양한 기기 환경에 대응하는 반응형 퍼블릭 페이지 제공. |
| **P1** | 필수 | **개발자 특화 컴포넌트** | GitHub 잔디(Contribution) 연동 및 기술 스택 배지 노출. |
| **P1** | 필수 | **소셜 아이콘 연동** | GitHub, LinkedIn, Twitter, YouTube 등 브랜드 아이콘 자동 매칭. |
| **P1** | 선택 | **Bento 레이아웃 v1** | 카드 형태의 그리드 레이아웃을 통한 프로젝트 하이라이트. |
| **P2** | 선택 | **링크 클릭 조회수(Postponed)** | 각 링크의 클릭 조회수를 기록하고 통계를 제공 (추후 구현). |

---

## 3. 상세 기능 명세

### 3.1. [P0] 인증 및 사용자 관리 (Auth)
*   **설명:** 구글 계정을 통한 빠르고 안전한 인증 시스템.
*   **상세 내용:**
    *   **Google OAuth:** Firebase Auth를 활용한 1-Click 로그인.
    *   **Session:** 사용자별 고유 UID를 기반으로 한 개인 설정 데이터 매칭.
    *   **User Data:** 사용자의 고유 `displayName` 정보를 기반으로 프로필 초기화.

### 3.2. [P0] 모바일 우선 반응형 디자인 (Mobile-First Design)
*   **설명:** 타인에게 공유되는 퍼블릭 페이지의 시각적 완성도와 접근성 극대화.
*   **상세 내용:**
    *   **Responsive UI:** 모바일, 태블릿, 데스크톱 등 모든 해상도에서 깨짐 없는 유연한 레이아웃.
    *   **Touch Friendly:** 모바일 환경에서 링크 클릭이 용이하도록 충분한 버튼 크기와 간격 확보.
    *   **Fast Loading:** Next.js의 이미지 최적화를 통해 모바일 네트워크에서도 빠른 로딩 보장.

### 3.3. [P0] 실시간 프로필 편집 (Real-time Editor)
*   **설명:** `shadcn/ui` 기반의 세련된 편집 환경 제공.
*   **상세 내용:**
    *   **UI Library:** `shadcn/ui` 컴포넌트를 사용하여 일관되고 모던한 편집 폼 구축.
    *   **Link Management:** 링크 추가/수정/삭제 시 Firestore 서브 컬렉션에 실시간 반영.
    *   **Tech Stack Badge:** 개발자 특화 배지 선택 및 노출 UI.

### 3.4. [P1] 개발자 대시보드 (Dev Insights)
*   **설명:** 외부 API 연동을 통한 동적 콘텐츠 제공.
*   **상세 내용:**
    *   **GitHub Integration:** GitHub API를 호출하여 최근 커밋 내역이나 Repository 요약 정보 노출.
    *   **External Content:** 크리에이터를 위한 YouTube 최신 영상 임베드 카드 지원.

---

## 4. 기술적 고려사항
*   **Framework:** Next.js 15 (App Router)
*   **UI Library:** **shadcn/ui**
*   **Backend as a Service (BaaS):** **Firebase**
    *   **Authentication:** Google 소셜 로그인.
    *   **Firestore (Database Modeling):**
        *   `users` (Collection): `uid`, `email`, `displayName`, `photoURL`, `bio`, `techStack` 등 저장.
        *   `users/{uid}/links` (Sub-collection): 각 사용자의 개별 링크 항목(`title`, `url`, `favicon`, `createdAt`) 저장.
    *   **Storage:** 프로필 및 카드 배경 이미지 저장.
*   **Performance:** 서버 사이드 렌더링(SSR)을 통한 빠른 초기 로딩 및 SEO 최적화.
