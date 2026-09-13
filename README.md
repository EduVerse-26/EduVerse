# EduVerse

EduVerse is a modern, integrated web platform for higher education campus management and academic workflows. It provides dedicated role-based dashboards and features for Administrators, Heads of Departments (HODs), Faculty, and Students.

## Architecture

EduVerse is built as a clean web application using Next.js 15 (Turbopack, App Router) and React 19, backed by shared TypeScript packages:

- `apps/web`: Next.js web application with Tailwind CSS, Lucide icons, Radix UI components, Monaco Editor, Recharts, and React Query.
- `packages/api`: Mock and client API layer for authentication, courses, attendance, assignments, quizzes, coding exams, counseling, and notifications.
- `packages/config`: Role definitions, navigation items, constants, and theme design tokens.
- `packages/types`: Core TypeScript interfaces and domain data models.
- `packages/utils`: Shared utilities for formatting, date/time calculations, grading, and test execution.
- `packages/validation`: Zod schemas for runtime request validation.

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher

## Getting Started

### 1. Install Dependencies

Install all dependencies across the workspace using standard npm:

```bash
npm install
```

### 2. Start the Development Server

Start the EduVerse web application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds the web application for production |
| `npm run lint` | Runs ESLint across the codebase |
| `npm run type-check` | Runs TypeScript type verification |
| `npm run clean` | Cleans build artifacts and caches |
