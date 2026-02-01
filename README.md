# About
## Development Process Summary

**The Process:**
- Testing an agentic TDD development workflow with Claude Code
- Voice-to-text requirements → loose plan → [user stories](project_context/plan.md)
- Used specialized [agents](https://github.com/citypaul/.dotfiles/tree/main/claude/.claude) from `.claude/agents/` folder (contributed by experienced TDD practitioner)

**Initial Issues:**
- User stories weren't perfectly defined (rushed the planning phase)
- First implementation had scope creep - I think Claude grabbed multiple user stories from context window and implemented more than intended
- Had to explicitly instruct Claude to only implement what's in scope for current user story, even if code will change later

**What Worked:**
- TDD Guardian agent always enforced RED-GREEN-REFACTOR cycle
- Agent reliably followed [TDD instructions](project_context/plan.md#agent-workflow-per-ticket) throughout development

**What Didn't Work Consistently:**
- Didn't make full use of PR Reviewer agent
- Progress Guardian only worked for 1st and 11th user story (PLAN.md/WIP.md/LEARNINGS.md structure), then stopped being used, not sure why it was partial invoked (although seemed to be used on bigger changes)
- Claude's behavior varied between sessions - sometimes autonomous, sometimes requesting approval for every action
- US-11 specifically was more pedantic/manual than other features (unclear if due to feature complexity or context state)

**Next Time:**
- Take more time defining precise, well-scoped user stories upfront
- Connect GitHub integration for issue tracking
- Thorough code review pass before finalizing

<img width="800" alt="image" src="https://github.com/user-attachments/assets/3d3600f3-e4bc-4231-8415-b3cffcf38119" />

<img width="800" alt="image" src="https://github.com/user-attachments/assets/b2f22b55-fd9c-4542-aeb0-17f9a9a62b38" />



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
