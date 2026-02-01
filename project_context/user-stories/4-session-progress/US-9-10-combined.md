# US-9/10: View Session Progress and Upcoming Intervals

**As** Thomas
**I want** to see my current progress and upcoming intervals
**So that** I know where I am in the workout and what's coming next

## Acceptance Criteria

- [ ] Bottom section displays upcoming intervals list
- [ ] Shows current interval + next 4-5 intervals (5-6 total visible)
- [ ] Interval format: "N. Phase: Duration" (e.g., "1. Prepare: 5", "2. Work: 60")
- [ ] Current interval is distinguished with bold text
- [ ] Progress indicator shows "X/10" format at bottom
- [ ] List is scrollable if more than 6 intervals
- [ ] Intervals use phase-appropriate text styling

## Design Specifications

### Layout
- **Position**: Bottom section of timer screen (below countdown)
- **Structure**:
  - Upcoming intervals list (scrollable container)
  - Progress indicator below list

### Interval List
- **Format**: `{number}. {Phase}: {duration}`
  - Example: "1. Prepare: 5"
  - Example: "2. Work: 60"
- **Visible Items**: Current interval + next 4-5 (max 5-6 total)
- **Current Interval Styling**: Bold font weight
- **Dividers**: Horizontal lines between intervals
- **Scrolling**: Allow scroll if total intervals > 6

### Progress Indicator
- **Format**: "X/10" (current interval / total intervals)
- **Position**: Below interval list, centered
- **Typography**: Large, clear text

### Colors
- Use phase-appropriate text colors that work with the phase background
- Ensure sufficient contrast for readability

## Resources
- UI Inspiration: `project_context/ui-inspiration/IMG_3589.PNG` (Prepare phase)
- UI Inspiration: `project_context/ui-inspiration/IMG_3590.PNG` (Work phase)

## Out of Scope (Future Stories)
- Previous/Next navigation buttons
- Round progress indicator (1/1 format)
- Interval replay controls
