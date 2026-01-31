# Plan: US-1 - Start a Tabata Session

**Created**: 2026-01-31
**Status**: In Progress
**Branch**: 1-as-thomas-i-want-to-start-a-tabata-timer-session-with-a-single-tap-so-that-i-can-quickly-begin-my-workout-without-configuration

## Goal

Enable Thomas to start a Tabata session with a single tap, beginning with a 10-second prepare phase, with no configuration required.

## Acceptance Criteria

- [ ] Single "Start" button on home screen
- [ ] Session begins with first 10-second prepare phase
- [ ] No configuration needed (all settings baked in)

## Steps

### Step 1: Create timer types and constants

- **Test**: N/A (type definitions and constants)
- **Done when**: TypeScript types defined for timer state, phase enum, and Tabata constants (10s prepare, 60s work, 10s rest, 8 rounds) exist in types/timer.ts and constants/tabata.ts

### Step 2: Implement timer countdown logic with tests

- **Test**: Write failing tests for:
  - Timer counts down from initial time
  - Timer decrements by 1 second each tick
  - Timer stops at 0
  - Timer can be paused and resumed
- **Done when**: All tests pass, useTimer hook manages countdown state correctly

### Step 3: Implement phase transition logic with tests

- **Test**: Write failing tests for:
  - Prepare phase (10s) transitions to work phase (60s)
  - Work phase transitions to rest/prepare phase (10s)
  - Final work phase completes session (no transition)
  - Correct interval counting (1-8 rounds)
- **Done when**: All tests pass, timer automatically transitions between phases

### Step 4: Create Home component with Start button

- **Test**: Write failing tests for:
  - Home component renders a "Start" button
  - Clicking Start button triggers session start callback
  - Button is styled and accessible
- **Done when**: All tests pass, Home component exists with functional Start button

### Step 5: Create Timer display component

- **Test**: Write failing tests for:
  - Timer component displays countdown number
  - Timer shows current phase (Prepare/Work/Rest)
  - Timer receives and displays correct time values
- **Done when**: All tests pass, Timer component renders countdown and phase

### Step 6: Integrate routing and state management

- **Test**: Write failing tests for:
  - App navigates from Home to Timer on Start
  - Timer receives initial state (prepare phase, 10s)
  - Session state persists during active session
- **Done when**: All tests pass, complete flow works: Home Start button → Timer with prepare phase countdown

### Step 7: Add basic styling with Tailwind

- **Test**: Visual verification (no automated tests for styling)
- **Done when**: 
  - Home screen has centered Start button with appropriate sizing
  - Timer screen shows large countdown (120px), phase indicator (48px)
  - Prepare phase uses green background (#22c55e)
  - Mobile-first responsive design (320-400px width)

---

*Changes to this plan require explicit approval.*
