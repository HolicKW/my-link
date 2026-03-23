# CLAUDE.md

This file provides development guidelines and context for the My Link project.

## 1. Project Overview
*   **Project Name:** My Link
*   **Purpose:** A Linktree clone service that allows developers and creators to integrate their tech stack, projects, and social media into a single page for personal branding.
*   **Main Tech Stack:**
    *   **Framework:** Next.js 15 (App Router)
    *   **Library:** React 19
    *   **Styling:** Tailwind CSS v4, shadcn/ui
    *   **Icons:** Lucide React
    *   **BaaS:** Firebase (Authentication, Firestore, Storage)
    *   **Language:** TypeScript

## 2. Project Structure
*   `app/`: Page and layout definitions based on Next.js App Router.
*   `components/`: Reusable UI components.
    *   `ui/`: Base components added via shadcn/ui.
*   `docs/`: Project documentation including PRD, scenarios, and wireframes.
*   `hooks/`: Custom React hooks.
*   `lib/`: Utility functions and configuration files.
*   `public/`: Static assets (images, favicons, etc.).

## 3. Build & Run Guide
Key commands for running and verifying the project locally.

*   **Start dev server:** `npm run dev` (uses Turbopack)
*   **Build project:** `npm run build`
*   **Start production server:** `npm run start`
*   **Lint check:** `npm run lint`
*   **Code formatting:** `npm run format` (Prettier)
*   **Type check:** `npm run typecheck`

## 4. Development Conventions & Guidelines
*   **UI Components:** When a new UI component is needed, prefer using `npx shadcn@latest add [component-name]` to add it under `components/ui`.
*   **Styling:** Make full use of Tailwind CSS v4 features; manage complex class combinations using the `cn` function in `lib/utils.ts`.
*   **Data Modeling:** Uses Firebase Firestore with the following structure:
    *   `users` collection: Basic user profile information.
    *   `users/{uid}/links` subcollection: Individual link data per user.
*   **Responsive Design:** Apply a Mobile-First approach to provide an optimized view across all screen sizes.
*   **Code Style:** Follow ESLint and Prettier configurations; run `npm run format` and `npm run lint` before committing to maintain code quality.

## 5. Reference Documents
*   Detailed planning: `docs/prd.md`
*   User scenarios: `docs/scenarios.md`
*   UI wireframes: `docs/wireframes.md`

## 6. Notes
*   If requirements are unclear or in doubt, ask the user questions to gather context before proceeding.
