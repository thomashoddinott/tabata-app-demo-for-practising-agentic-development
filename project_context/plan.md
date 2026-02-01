# Tabata Timer App - Implementation Plan

## 🎯 Project Goal

Build a randomized Tabata timer app that displays which exercise to perform during rest periods to keep workouts unpredictable and challenging.

## 👤 Persona

**Thomas - The Time-Efficient Calisthenics Enthusiast**
- Age: 33
- Fitness Level: Intermediate to Advanced
- Workout Frequency: 4-5 times per week
- Session Duration: 10-15 minutes (short, intense Tabata sessions)
- Environment: Outdoor gym/park, minimal equipment
- Pain Point: Gets into repetitive workout patterns, body adapts and progress plateaus
- Goal: Keep workouts varied and challenging through randomization, without having to think about what's next
- Value Proposition: "10 minutes of pain, then you're done - not exhausted for the rest of the day"
- Results: Feels good, seeing positive results from consistent short sessions
- Tech Comfort: Comfortable with mobile apps, prefers simple, no-configuration interfaces

## 📋 User Stories

### Epic 1: Core Timer Functionality
- [US-1: Start a Tabata Session](original-user-stories/1-core-timer-functionality/US-1.md)
- [US-2: View Countdown Timer](original-user-stories/1-core-timer-functionality/US-2.md)
- [US-3: See Current Phase (Prepare vs Work)](original-user-stories/1-core-timer-functionality/US-3.md)

### Epic 2: Randomized Exercise Display
- [US-4: See Next Exercise During Prepare Phase](original-user-stories/2-randomized-exercise-display/US-4.md)
- [US-5: See Current Exercise During Work Phase](original-user-stories/2-randomized-exercise-display/US-5.md)
- [US-6: No Exercise Repetition Back-to-Back](original-user-stories/2-randomized-exercise-display/US-6.md)

### Epic 3: Audio Feedback
- [US-7: Countdown Beeps](original-user-stories/3-audio-feedback/US-7.md)
- [US-8: Different Tones for Phase Types](original-user-stories/3-audio-feedback/US-8.md)

### Epic 4: Session Progress Indicators
- [US-9/10: View Session Progress and Upcoming Intervals](original-user-stories/4-session-progress/US-9-10-combined.md) *(Merged from US-9 and US-10 - both features are tightly coupled)*

### Epic 5: Session Control
- [US-11: Pause/Resume Session](original-user-stories/5-session-control/US-11.md)
- [US-12: Navigate Between Intervals](original-user-stories/5-session-control/US-12.md) *(Optional/Future)*

## 🏗️ Technical Implementation

### Architecture Decisions

**State Management**
- React `useState` and `useReducer` for timer state
- Centralized timer reducer to manage phase, remaining time, current interval
- Exercise randomization logic in custom hook (`useRandomExercises`)

**Timer Implementation**
- `setInterval` for countdown (1-second resolution)
- `useEffect` to manage timer lifecycle
- Cleanup on unmount to prevent memory leaks

**Audio Generation**
- Web Audio API (`AudioContext`, `OscillatorNode`)
- Generate simple sine wave tones programmatically
- Different frequencies: prepare (~800Hz) vs work (~1200Hz)
- No external audio files needed

**Styling**
- Tailwind CSS for utility-first styling
- Mobile-first responsive design (max-width ~400px)
- Custom theme colors for prepare (green) and work (red) phases

**Testing**
- Vitest (Vite's recommended test runner)
- React Testing Library for component tests
- Mock timers for timer logic

### File Structure

```
src/
├── components/
│   ├── Timer/
│   │   ├── Timer.tsx              # Main timer component
│   │   ├── TimerDisplay.tsx       # Large countdown number
│   │   ├── PhaseIndicator.tsx     # "Prepare"/"Work" header
│   │   ├── ExerciseDisplay.tsx    # Exercise name display
│   │   ├── IntervalList.tsx       # Upcoming intervals list
│   │   ├── ProgressIndicator.tsx  # X/10 progress display
│   │   └── TimerControls.tsx      # Pause/play buttons
│   └── Home/
│       └── Home.tsx               # Landing page with Start button
├── hooks/
│   ├── useTimer.ts                # Timer countdown logic
│   ├── useRandomExercises.ts      # Exercise randomization
│   └── useAudio.ts                # Web Audio API wrapper
├── types/
│   └── timer.ts                   # TypeScript interfaces
├── constants/
│   └── exercises.ts               # List of 10 exercises
├── utils/
│   └── audioGenerator.ts          # Tone generation helpers
├── App.tsx
├── main.tsx
└── index.css                       # Tailwind directives
```

### Implementation Phases (TDD)

#### Phase 1: Core Timer Logic
- Tests FIRST for timer countdown, phase transitions, pause/resume
- Implement minimal code to pass tests
- Files: `timer.ts`, `useTimer.ts`

#### Phase 2: Exercise Randomization
- Tests for random selection with no consecutive duplicates
- Implement randomization algorithm
- Files: `exercises.ts`, `useRandomExercises.ts`

#### Phase 3: Audio System
- Tests for beep generation at correct times
- Web Audio API implementation
- Files: `audioGenerator.ts`, `useAudio.ts`

#### Phase 4: UI Components
- Tests for component rendering and interactions
- Implement with Tailwind styling
- Files: All component files

#### Phase 5: Integration & Polish
- End-to-end testing
- Tailwind theme customization
- Cross-browser testing

## 🔄 Development Loop

### Ticket-Based Workflow (GitHub)

Each GitHub issue contains:
- User story reference
- Description
- Acceptance criteria

### Core Workflow

```
1. Pull down ticket from GitHub
   ↓
2. Always enter planning mode first
   ↓
3. Generate internal tracking documents
   - PLAN.md (what we're doing)
   - WIP.md (where we are)
   - LEARNINGS.md (what we discovered)
   ↓
4. Create new branch named after ticket
   (never write to main)
   ↓
5. Delegate work to agent team
   ↓
6. Agent (human for now) creates PR on GitHub
   ↓
7. Manual review, test, and merge
   (final say always with you)
```

### Agent Team

**Available Agents** (see `.claude/agents/` folder):

**Development Process:**
- `tdd-guardian` - Enforces RED-GREEN-REFACTOR cycle
- `ts-enforcer` - TypeScript strict mode enforcement
- `refactor-scan` - Refactoring assessment after tests pass

**Code Review:**
- `pr-reviewer` - Comprehensive PR review (TDD, TypeScript, functional patterns)

**Documentation & Knowledge:**
- `docs-guardian` - Maintains permanent documentation (README, guides, API docs)
- `adr` - Architecture Decision Records for significant decisions
- `learn` - Captures learnings, gotchas, patterns into CLAUDE.md

**Analysis & Architecture:**
- `use-case-data-patterns` - Maps use cases to data access patterns

**Workflow & Planning:**
- `progress-guardian` - Manages PLAN.md, WIP.md, LEARNINGS.md for incremental work

### Your Role

Senior software engineer/architect delegating tasks - maintaining oversight and control, not letting agents run completely free.

### Agent Workflow Per Ticket

```
Start Ticket
  ↓
progress-guardian: Create PLAN.md, WIP.md, LEARNINGS.md
  ↓
For each step in plan:
  ↓
  tdd-guardian: Guide RED-GREEN-REFACTOR
  ↓
  ts-enforcer: Verify TypeScript strictness before commit
  ↓
  refactor-scan: Assess improvements after GREEN
  ↓
  progress-guardian: Update WIP.md, capture learnings
  ↓
  Await commit approval (YOU approve)
  ↓
End of ticket:
  ↓
  pr-reviewer: Review PR before submission
  ↓
  Create PR on GitHub
  ↓
  progress-guardian: Merge learnings, delete docs
  ↓
  Manual review and merge (YOU approve)
```

## 🎨 UI Specifications

### Design Inspiration

See [UI screenshots](ui-inspiration/) for reference design from existing Tabata timer app.

### Color Scheme

**Prepare Phase (Rest)**
- Background: `#22c55e` (green)
- Text: White (`#ffffff`)
- High contrast for outdoor visibility

**Work Phase (Exercise)**
- Background: `#ef4444` (red/orange)
- Text: White (`#ffffff`)
- Distinct from prepare phase

**Neutral/Home**
- Background: Dark (`#1f2937` or similar)
- Accent: Primary green/red

### Typography

- **Countdown Timer**: 120px font size, bold weight, monospace or sans-serif
- **Phase Title** ("Prepare"/"Work"): 48px, light weight
- **Exercise Name**: 32-40px, medium weight, uppercase
- **Interval List**: 18-20px, normal weight
- **Progress Indicator**: 16-18px, normal weight

### Layout

**Mobile-First Design**
- Target width: 320-400px (phone portrait)
- Full viewport height: `100vh`
- Centered content with flexbox
- Fixed bottom controls

**Component Hierarchy**
```
┌─────────────────────────────┐
│  < [Back]  Prepare  [||]    │  ← Header (phase + controls)
├─────────────────────────────┤
│                             │
│        BURPEES              │  ← Exercise Name
│                             │
│           4                 │  ← Large Countdown
│                             │
├─────────────────────────────┤
│  1. Prepare: 10             │
│  2. Work: 60                │  ← Upcoming Intervals List
│  3. Prepare: 10             │     (scrollable)
│  4. Work: 60                │
│  5. Prepare: 10             │
├─────────────────────────────┤
│   |◀   1/10  •  1/1   ▶|   │  ← Progress (interval/set)
└─────────────────────────────┘
```

### Tailwind Configuration

Custom theme extensions needed:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'prepare': '#22c55e',
      'work': '#ef4444',
    }
  }
}
```

## 📝 Placeholder Exercises

Initial set of 10 bodyweight exercises:

```typescript
export const EXERCISES = [
  'Push-ups',
  'Squats',
  'Burpees',
  'Lunges',
  'Mountain Climbers',
  'Plank',
  'Jumping Jacks',
  'High Knees',
  'Bicycle Crunches',
  'Jump Squats',
] as const;
```

**Notes:**
- All bodyweight exercises (no equipment needed)
- Mix of upper body, lower body, and full body movements
- Suitable for outdoor/minimal equipment environments
- Can be replaced with user's custom list in future versions
