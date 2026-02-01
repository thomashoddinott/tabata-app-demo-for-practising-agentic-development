# About
## Development Process Summary

**The Process:**
- Testing an agentic TDD development workflow with Claude Code
- Voice-to-text requirements → loose plan → [user stories](project_context/plan.md)
- Used specialized agents from `.claude/agents/` originally from https://github.com/citypaul/.dotfiles/tree/main/claude/.claude

**Initial Issues:**
- User stories weren't perfectly defined (rushed the planning phase)
- First implementation had scope creep - I think Claude grabbed multiple user stories from context window and implemented more than intended
- Had to explicitly instruct Claude to only implement what's in scope for current user story, even if code will change later

**What Worked:**
- TDD Guardian agent always enforced RED-GREEN-REFACTOR cycle

<p align="center" width="100%">
    <img width="800" alt="image" src="https://github.com/user-attachments/assets/3d3600f3-e4bc-4231-8415-b3cffcf38119" />
</p>

- Always entered planning mode, launched subagents (always? or only for larger tasks?)

<p align="center" width="100%">
    <img width="800" alt="image" src="https://github.com/user-attachments/assets/b2f22b55-fd9c-4542-aeb0-17f9a9a62b38" />
</p>

**What Didn't Work Consistently:**
- Progress Guardian only worked for 1st and 11th user story (PLAN.md/WIP.md/LEARNINGS.md structure), then stopped being used, not sure why it was partial invoked (although seemed to be used on bigger changes)
- Basically the agents weren't always used and I'd make Claude use them at the end of the TDD cycle next time `ts-enforcer` `refactor-scan` etc.
- Claude's behavior varied between sessions - sometimes autonomous, sometimes requesting approval for every action
- US-11 specifically was more pedantic/manual than other features (unclear if due to feature complexity or context state)

**Next Time:**
- Take more time defining precise, well-scoped user stories upfront
- Enforce use of all agents (stricter claude.md?)
- Connect GitHub integration for issue tracking
- Thorough code review pass before finalizing
