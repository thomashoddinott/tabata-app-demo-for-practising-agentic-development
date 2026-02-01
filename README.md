# About
```
Voice to text of my thoughts, then I'll tidy up:
- I'm testing an Agentic TDD dev flow
- I basically dictated a big wall of text into Claude and had it come up with a user stories for me. First thing that went wrong was actually the user stories weren't perfectly defined and I rushed a bit because I was just eager to see how fast I could do it second time around I would take more time on the user stories sounds obvious but I didn't this time cause I was rushing.
– Then I copied some agents in from a experienced Dave who's been using Claude with TDD.
– And I went use a story per user story. Again the first thing that happened was that my first attempt implemented a lot of more than I was expecting so it kind of grabbed I think there was scope creep because I had a lot of context in the context window and it grabbed the other user stories and started implementing which is not what I intended but anyway, after that I told Claude to be a bit more discerning on the user stories and to just implement what's in the scope of the user story even if it means coding stuff in which will change in the next user story after that things went a bit better and okay let's do.
– The main thing that impressed me was the TDD flow itself. The agent pretty much always did what he was told at the TDD guardian file I was impressed by that

– I didn't make great use of the other agents this time such as the PR review agent
– I also would definitely connect to the hub to the Claude so I don't have to so I can just upload my user stories as issues for example
– Had some specific instructions about how I want Claude to handle each user story so that it always enters a planning mode then you know tracks things internally actually what happened here was it? Didn't the first user story? Did it stuck very closely to the plan working in progress learning structure then after that, I didn't do it at all for all the other user stories implemented and then

– I'll pass I'd like improvements. I'd like to pass over this code with maybe some other agents because I just rushed I didn't review things as thoroughly as I'd like to.
```

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
