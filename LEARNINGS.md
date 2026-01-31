# Learnings: US-1 - Start a Tabata Session

*Temporary document - will be merged into knowledge base at end of feature*

## Gotchas

(None yet - will capture as we encounter issues)

## Patterns That Worked

(Will document successful patterns as we implement)

## Decisions Made

### Timer Resolution: 1-second intervals
- **Context**: Tabata timer needs countdown display
- **Options**: 
  1. setInterval with 1000ms (1 second)
  2. setInterval with 100ms for smoother updates
  3. requestAnimationFrame for precision
- **Decision**: setInterval with 1000ms
- **Rationale**: 
  - Tabata timers show whole seconds only
  - No need for sub-second precision
  - Simpler implementation, easier to test with mock timers
  - Matches user story requirements (10s, 60s intervals)

### State Management: React hooks (useState/useReducer)
- **Context**: Need to manage timer state, phase transitions
- **Options**:
  1. useState for simple state
  2. useReducer for complex state transitions
  3. External state library (Zustand, Redux)
- **Decision**: useReducer for timer state
- **Rationale**:
  - Timer has complex state transitions (prepare → work → rest, interval counting)
  - Reducer pattern makes transitions predictable and testable
  - No need for external library yet (single feature)
  - Aligns with plan.md architecture decisions

## Edge Cases

(Will document as we encounter them during implementation)
