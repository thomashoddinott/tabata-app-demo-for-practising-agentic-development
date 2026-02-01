# Learnings: US-11 Pause/Resume Session

*Temporary document - will be merged into knowledge base at end of feature*

## Gotchas

(None yet - will capture as discovered during implementation)

## Patterns That Worked

(Will capture successful approaches during implementation)

## Decisions Made

### Use Existing pause/start Functions
- **Options**: Create new pause/resume logic vs. use existing infrastructure
- **Decision**: Leverage existing `pause()` and `start()` functions in `useTimer` hook
- **Rationale**: Infrastructure already exists and is tested; this is primarily a UI integration task, not a new feature implementation

### Button Position: Top-Left Corner
- **Options**: Top-right vs. top-left vs. bottom vs. overlay
- **Decision**: Position at `absolute top-4 left-4` (opposite debug indicator)
- **Rationale**: 
  - Debug indicator is top-right, so top-left keeps UI balanced
  - Top placement keeps it visible but out of main content area
  - Absolute positioning allows it to float over timer display

### Icons: Text-Based || and ▶
- **Options**: SVG icons vs. emoji vs. text symbols
- **Decision**: Use text symbols `||` for pause, `▶` for play
- **Rationale**:
  - No icon library dependency needed
  - Universally recognized symbols
  - Consistent with project's minimal dependencies approach
  - Easy to style with Tailwind text utilities

## Edge Cases

(Will capture as discovered during testing)
