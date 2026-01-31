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

This is a Tabata timer application demo repository for practicing agentic development. The app provides a simple, one-tap interface for starting Tabata workout sessions with pre-configured timing (10s prepare, 60s work, 10s rest, 8 rounds).

**Tech Stack:**
- React 19 with TypeScript
- Vite 7 (build tool with HMR)
- Tailwind CSS 3 (utility-first styling)
- Vitest (unit and integration testing)
- ESLint with TypeScript, React Hooks, and React Refresh plugins

**Testing Infrastructure:**
- Vitest with jsdom environment for React component testing
- React Testing Library for component tests
- Mock timers for countdown logic tests
- 18 tests covering hooks, components, and integration flows

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

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
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

**Timer Implementation:**
- Custom `useTimer` hook with useReducer for state management
- Timer resolution: 1-second intervals (setInterval)
- Automatic phase transitions (prepare → work → rest)
- Phase-specific configurations defined in `src/constants/tabata.ts`
- All timer logic is fully tested with mock timers

## Design Patterns and Decisions

### Timer State Management

**Decision**: Use `useReducer` for timer state instead of `useState`

**Rationale**:
- Timer has complex state transitions (prepare → work → rest, interval counting)
- Reducer pattern makes transitions predictable and testable
- Centralizes state logic in one place
- Easier to debug and reason about state changes

### Timer Resolution

**Decision**: Use `setInterval` with 1000ms (1 second) intervals

**Rationale**:
- Tabata timers show whole seconds only
- No need for sub-second precision
- Simpler implementation, easier to test with mock timers
- Matches user story requirements (10s, 60s intervals)
- Alternative approaches (100ms intervals, requestAnimationFrame) add unnecessary complexity

### Testing Approach

**Pattern**: Test-Driven Development (TDD) with React Testing Library

**What worked**:
- Write failing tests first (RED)
- Implement minimal code to pass (GREEN)
- Refactor with confidence (REFACTOR)
- Mock timers (vi.useFakeTimers()) for deterministic countdown tests
- Integration tests verify complete user flows (Home → Timer → Phase transitions)

## Component Architecture

```
src/
├── components/
│   ├── Home.tsx           # Start button screen
│   ├── Timer.tsx          # Countdown display with phase indicator
├── hooks/
│   └── useTimer.ts        # Timer countdown and phase transition logic
├── types/
│   └── timer.ts           # TypeScript types (Phase, TimerState, SessionConfig)
├── constants/
│   └── tabata.ts          # Tabata timing configuration (TABATA_CONFIG)
└── App.tsx                # Root component with routing logic
```

## Feature Completion

### US-1: Start a Tabata Session (COMPLETED)
- Single "Start" button on home screen
- Session begins with 10-second prepare phase
- No configuration needed (settings baked in)
- Full test coverage (18 tests passing)
- Commits: 23e147c, 4a913ef, 2b0ece0, fb3c5c7, ce43672, 92045af
