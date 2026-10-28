# Custom Hooks

Ten focused React hooks for the things you keep writing. Strict TypeScript, small implementations, dedicated tests, and a playground that runs the actual hooks.

This is a **source-code collection and reference**, with a Vite demo. It is not published to npm. Copy the hooks you need into your React project.

## The collection

| Hook                                                   | Purpose                                 | Example use case                        |
| ------------------------------------------------------ | --------------------------------------- | --------------------------------------- |
| [useToggle](docs/hooks/useToggle.md)                   | Boolean state with stable actions       | Notification switches, expanded panels  |
| [useCounter](docs/hooks/useCounter.md)                 | Increment, decrement, and reset         | Quantity selectors, step counters       |
| [useDebounce](docs/hooks/useDebounce.md)               | Delay a changing value                  | Search input, delayed previews          |
| [useLocalStorage](docs/hooks/useLocalStorage.md)       | Persist JSON state and synchronize tabs | Preferences, small drafts               |
| [useMediaQuery](docs/hooks/useMediaQuery.md)           | React to a CSS media query              | Responsive behavior, motion preferences |
| [usePrevious](docs/hooks/usePrevious.md)               | Read the previous committed value       | Comparing successive values             |
| [useOnClickOutside](docs/hooks/useOnClickOutside.md)   | Detect outside pointer interactions     | Dropdowns, popovers                     |
| [useEventListener](docs/hooks/useEventListener.md)     | Manage a typed DOM listener             | Keyboard shortcuts, resize handling     |
| [useInterval](docs/hooks/useInterval.md)               | Run and pause a repeating callback      | Timers, periodic UI updates             |
| [useCopyToClipboard](docs/hooks/useCopyToClipboard.md) | Copy text with honest status feedback   | Share buttons, code snippets            |

Each hook lives in its own file, has no dependency on another custom hook, and only imports from React. Timers and subscriptions clean up automatically. The browser hooks include server-rendering fallbacks.

## Getting started

Use Node.js **24 LTS** (see [.nvmrc](.nvmrc)) and npm. The configured engine range also supports Node 22.13+ within the 22.x release line.

```sh
git clone https://github.com/pulkitdotio/custom-hooks.git
cd custom-hooks
npm install
npm run dev
```

Open the local URL printed by Vite. The playground starts in dark mode. Search for a hook, interact with its example, copy usage code, or follow the documentation and source links. The theme choice persists when browser storage is available. A URL such as `http://localhost:5173/#useCounter` opens a specific hook.

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## Commands

| Command              | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Start the local Vite playground                           |
| `npm run build`      | Check TypeScript and create the production app in `dist/` |
| `npm run preview`    | Serve the built app locally                               |
| `npm run lint`       | Check source, tests, and configuration with ESLint        |
| `npm run typecheck`  | Check strict application, test, and build-config types    |
| `npm test`           | Run the complete Vitest suite once                        |
| `npm run test:watch` | Rerun tests as files change                               |

CI uses `npm ci`, then runs lint, typecheck, tests, and the production build. No deployment or publication is configured.

## Reusing a hook

1. Copy the needed file from [src/hooks](src/hooks) into your application, for example `src/hooks/useToggle.ts`.
2. Keep React installed in your project. The hook implementations use APIs available in React 18 and 19; this repository tests against its locked React 19 version.
3. Adjust the import path and use it in a component or another hook.

```tsx
import { useToggle } from './hooks/useToggle';

export function Details() {
  const { value: expanded, toggle } = useToggle(false);

  return (
    <section>
      <button aria-expanded={expanded} onClick={toggle}>
        Toggle details
      </button>
      {expanded && <p>Here are the details.</p>}
    </section>
  );
}
```

If you copy the whole folder, its [index.ts](src/hooks/index.ts) also exports all hooks and their public result types. Tailwind, Lucide, and Vite are used by the playground only; copied hooks do not need them. Usage code in the playground assumes a local `./hooks/` folder.

## Structure

```text
src/
  hooks/           # Independent hook files and public exports
  examples/        # Ten interactive examples and copyable usage snippets
  components/      # Playground code viewer
  App.tsx          # Search, navigation, theme, and selected example
  index.css        # Tailwind and the playground's light/dark styles
docs/hooks/        # Signatures, examples, behavior, and limitations
tests/             # Hook, server rendering, hydration, and playground tests
.github/workflows/ # CI checks
```

## Technology

React 19, TypeScript 6 in strict mode, Vite 8, Tailwind CSS 4, Lucide React, Vitest 5, React Testing Library, jsdom, and ESLint 10. npm's lockfile records the exact dependency versions.

## Tests

Every hook has dedicated behavior tests. The suite covers initial values, batched functional updates, reset behavior, changing inputs and targets, stale callback prevention, timer and listener cleanup, storage events and failures, malformed JSON, and clipboard rejection and concurrent requests. Server-rendering tests run in Node without browser globals. Playground tests exercise search, navigation, themes, and the working demos.

Debounce and interval tests use fake timers. The zero-delay interval smoke test uses real timers to avoid a fake clock repeatedly scheduling the same zero-time tick.

## Limitations

- `useLocalStorage` uses JSON without a custom serializer or runtime schema validation. Dates become strings on reload; functions, cycles, and BigInt cannot persist. Failed reads, writes, or serialization fall back to per-instance memory until a key change or remount. It is not suitable for secrets or large datasets.
- Storage events are delivered asynchronously across tabs and are not transactional. Concurrent writes use the browser's last-write-wins behavior. Hook instances using the same key should share a type and fallback. Same-tab synchronization covers writes through this hook; raw `localStorage` writes in the same tab do not emit native events.
- `useMediaQuery` returns `false` during server rendering and hydration, then reads the browser's match. It requires the modern `MediaQueryList.addEventListener` API. Use CSS for visual responsiveness when possible.
- `usePrevious` returns the previous commit, not the previous distinct value. It does not trigger its own render.
- `useOnClickOutside` handles `pointerdown`, including mouse, touch, and pen. It is not a complete accessible dialog or focus-management solution.
- `useEventListener` supports window, document, and HTML element targets. Pass an actual element, not a ref object. Access globals such as `window` safely in your own call sites, or omit the target to use the browser window safely.
- Clipboard access requires browser support and usually HTTPS or localhost plus a user interaction. Permission failures return `false` and provide an error; there is no legacy copy fallback.
- Timers follow browser scheduling and throttling; the interval hook is not a precision clock. The demo is a client application; the hooks' server fallbacks are tested separately.

See each hook's documentation for its exact behavior and edge cases.

## Contributing

Keep changes small and focused. Discuss additional hooks in an issue before expanding the collection. For a behavior change, update its documentation, example, and tests together. Run all checks before opening a pull request:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Do not commit credentials, generated builds, or dependency folders. Use plain, descriptive commit messages.
