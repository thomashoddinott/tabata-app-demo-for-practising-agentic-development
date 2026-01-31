# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Project Plan & User Stories

**IMPORTANT:** Always consult [project_context/plan.md](project_context/plan.md) before starting any work. This file contains:
- The project goal and vision
- Thomas's persona (our target user)
- All user stories organized by epic
- Feature priorities and scope

When implementing features, building UI, or making architecture decisions, reference the plan to ensure alignment with user needs and project goals.

## Project Overview

This is a Tabata timer application demo repository for practicing agentic development. Currently in initial setup stage with Vite + React boilerplate.

**Tech Stack:**
- React 19 with TypeScript
- Vite 7 (build tool with HMR)
- ESLint with TypeScript, React Hooks, and React Refresh plugins

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler first)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture Notes

**TypeScript Configuration:**
- Strict mode enabled with modern ES2022 target
- Project uses composite TypeScript config (tsconfig.json references tsconfig.app.json and tsconfig.node.json)
- Compiler enforces strict null checks, no unused locals/parameters, and no fallthrough cases

**Build System:**
- Vite uses bundler module resolution with `verbatimModuleSyntax`
- Source files in [src/](src/) directory
- Entry point: [src/main.tsx](src/main.tsx) → [src/App.tsx](src/App.tsx)

**ESLint:**
- Flat config format (eslint.config.js)
- Ignores dist/ directory
- Applies recommended rules for JS, TypeScript, React Hooks, and React Refresh
