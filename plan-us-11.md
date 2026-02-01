# Plan: US-11 Pause/Resume Session

**Created**: 2026-02-01
**Status**: In Progress
**Branch**: 18-pauseresume-session

## Goal

Add pause/resume functionality to the Tabata timer, allowing users to handle interruptions without losing their place in the session.

## User Story

**As** Thomas
**I want** to pause the timer if I need a break
**So that** I can handle interruptions without losing my place

## Acceptance Criteria

- [ ] Pause button (||) visible during session
- [ ] Timer stops when paused
- [ ] Resume continues from paused state
- [ ] Audio beeps don't play while paused

## Key Finding

The pause/resume infrastructure **already exists** in the `useTimer` hook! This is primarily a UI integration task:
- `pause()` and `start()` functions are already implemented and tested
- `isActive` state controls the timer countdown
- Just need to expose these in the UI layer

## Implementation Phases

### Phase 1: Expose isActive State

**Goal**: Make timer active state available to UI components

**Test**: What failing test will we write?
- Add test in `useTimer.test.ts` verifying the hook returns `isActive` property
- Test should fail because `isActive` is not in `UseTimerResult` type

**Done when**:
- `isActive` added to `UseTimerResult` type in `src/hooks/useTimer.ts`
- `isActive` returned in hook's return object
- Test passes

---

### Phase 2: Add Pause/Resume Button UI

**Goal**: Create visible pause/resume button with correct icons

**Test**: What failing test will we write?
- Test in `Timer.test.tsx`: "should display pause button with || icon when timer is running"
- Test: "should display play button with ▶ icon when timer is paused"
- Tests should fail because button doesn't exist

**Done when**:
- Button element added to `Timer.tsx`, positioned `absolute top-4 left-4`
- Button conditionally renders `||` when `isActive === true`, `▶` when `isActive === false`
- Button styled with Tailwind: `text-white text-4xl p-2 min-w-[44px] min-h-[44px]` for mobile touch targets
- Tests pass

---

### Phase 3: Wire Up Pause Functionality

**Goal**: Clicking pause button stops the timer countdown

**Test**: What failing test will we write?
- Test: "should stop countdown when pause button is clicked"
- Test flow: render Timer → advance 2 seconds → click pause → advance 2 more seconds → verify time didn't change
- Should fail because onClick handler not implemented

**Done when**:
- `onClick` handler added to pause button
- Handler calls `pause()` when `isActive === true`
- Test passes showing countdown stops when paused

---

### Phase 4: Wire Up Resume Functionality

**Goal**: Clicking resume button continues countdown from paused state

**Test**: What failing test will we write?
- Test: "should resume countdown from paused state when play button clicked"
- Test flow: start timer → pause → click play → verify countdown continues
- Should fail if resume logic incomplete

**Done when**:
- onClick handler calls `start()` when `isActive === false`
- Test passes showing countdown resumes from paused state

---

### Phase 5: Verify Audio Silence While Paused

**Goal**: Confirm beeps don't play while timer is paused

**Test**: What failing test will we write?
- Test: "should not play beeps while timer is paused"
- Test flow: start timer → pause at 4 seconds → advance to 3, 2, 1 → verify no beeps
- Expected: Should PASS immediately (no code changes needed!)

**Done when**:
- Test confirms that pausing prevents audio beeps (this should work by design - audio beeps trigger via `useEffect` watching `remainingTime`, and when paused, `remainingTime` stops changing)
- Test passes

---

### Phase 6: Accessibility & Polish

**Goal**: Ensure button is accessible and user-friendly

**Test**: What failing test will we write?
- Test: "should have accessible label on pause/resume button"
- Should fail if aria-label missing

**Done when**:
- Dynamic `aria-label` added: "Pause timer" when running, "Resume timer" when paused
- `title` attribute added for mouse hover tooltip
- Button styling reviewed for consistency
- Button meets 44x44px touch target minimum
- Hover/active states added: `active:opacity-70 transition-opacity`
- Tests pass

---

### Phase 7: Integration Testing

**Goal**: Verify complete pause/resume workflows

**Test**: What failing test will we write?
- Full cycle: start → pause during work → resume → complete work → verify correct
- Multiple pause/resume cycles during single session
- Pause during phase transition edge cases
- Pause at different phases (prepare, work, rest)

**Done when**:
- All integration tests pass
- Edge cases handled correctly
- Complete workflows verified

---

## Critical Files

### Modified Files
1. **src/hooks/useTimer.ts** - Add `isActive` to return type and object
2. **src/components/Timer/Timer.tsx** - Add pause/resume button with onClick handlers

### Test Files
3. **src/hooks/useTimer.test.ts** - Test for `isActive` exposure
4. **src/components/Timer/Timer.test.tsx** - Tests for pause/resume functionality

## Edge Cases to Test
1. Pausing at 0 seconds during phase transition
2. Rapid pause/resume clicking
3. Pausing during prepare phase
4. Pausing during final work interval
5. Multiple pause/resume cycles

## Button Design Specification

**Position**: Top-left corner (`absolute top-4 left-4`)
**Icons**: `||` (pause) when running, `▶` (play) when paused
**Styling**:
```tsx
<button
  onClick={() => isActive ? pause() : start()}
  aria-label={isActive ? "Pause timer" : "Resume timer"}
  title={isActive ? "Pause timer" : "Resume timer"}
  className="absolute top-4 left-4 text-white text-4xl p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:opacity-70 transition-opacity"
>
  {isActive ? '||' : '▶'}
</button>
```

---

*Changes to this plan require explicit approval.*
