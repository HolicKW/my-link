# GEMINI.md - 프로젝트 컨텍스트

이 파일은 Gemini CLI 에이전트가 프로젝트를 더 잘 이해하고 효율적으로 작업을 수행할 수 있도록 돕는 지침 문서입니다.

## 1. 프로젝트 개요 (Project Overview)
- **프로젝트 명:** My Link / My Profile
- **주요 기술 스택:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **목적:** 사용자의 프로필 정보를 제공하는 웹 애플리케이션으로 추정됩니다.
- **아키텍처:** `app/` 디렉토리를 중심으로 한 Next.js App Router 기반의 현대적인 웹 아키텍처를 따릅니다.

## 2. 프로젝트 구조 (Project Structure)
- `my-profile/`: 메인 Next.js 애플리케이션 소스 코드
  - `app/`: 페이지, 레이아웃, 스타일 등 핵심 로직
  - `public/`: 정적 자산 (이미지, 로고 등)
  - `next.config.ts`: Next.js 설정 파일
  - `tsconfig.json`: TypeScript 설정 (경로 별칭 `@/*` 사용)
- `README.md`: 프로젝트의 기본 루트 정보

## 3. 빌드 및 실행 (Building and Running)
모든 명령어는 `my-profile` 디렉토리 내에서 실행되어야 합니다.

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev` | 로컬 개발 서버를 시작합니다. ([http://localhost:3000](http://localhost:3000)) |
| `npm run build` | 프로덕션을 위한 빌드를 수행합니다. |
| `npm run start` | 빌드된 프로덕션 서버를 실행합니다. |
| `npm run lint` | ESLint를 사용하여 코드 스타일 및 오류를 검사합니다. |

## 4. 개발 규칙 및 컨벤션 (Development Conventions)
- **프레임워크:** Next.js App Router를 사용하며, 서버 컴포넌트와 클라이언트 컴포넌트를 적절히 분리하여 사용합니다.
- **스타일링:** Tailwind CSS v4를 사용합니다. 유틸리티 클래스 기반의 스타일링을 지향합니다.
- **타입 시스템:** 엄격한 TypeScript 설정을 준수하며, `tsconfig.json`에 정의된 `@/*` 경로 별칭을 활용합니다.
- **폰트:** `next/font`를 통해 Geist Sans 및 Geist Mono 폰트를 최적화하여 사용합니다.
- **에디터 설정:** ESLint가 구성되어 있어 코드 품질을 유지합니다.

## 5. 작업 시 주의사항
- 코드를 수정할 때는 반드시 기존의 Tailwind CSS v4 설정을 확인하십시오.
- `app/layout.tsx`는 전역 레이아웃을 담당하므로 수정 시 주의가 필요합니다.
- `my-profile` 폴더 내부에서 작업을 수행하는 것이 기본 원칙입니다.
