# Testing

This setup uses [Vitest](https://vitest.dev/) with Solid Testing Library for
component behavior and [Playwright](https://playwright.dev/) for real browser
behavior. Not tested with Jest.

## Setup

Use the Solid 2 builds of the Vite plugin and Solid Testing Library.

```sh
pnpm add -D vitest jsdom @solidjs/vite-plugin @solidjs/testing-library@next @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

## Configuration

Create `vitest.config.ts`.

```ts
import solid from '@solidjs/vite-plugin';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setup-test.ts',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    server: {
      deps: {
        inline: ['@leverui/components'],
      },
    },
  },
});
```

- `globals: true`: no need to import `expect`, `test`, `describe`. Also lets
  Solid Testing Library clean up after each test.
- `inline`: required. Tests load Lever UI's browser build instead of its server
  build.
- `exclude`: keeps the Playwright specs from [Browser Tests](#browser-tests)
  out of the Vitest run.

TypeScript: add `"vitest/globals"` and `"@testing-library/jest-dom"` to `types`
in `tsconfig.json`.

## Setup Test File

Create `setup-test.ts`. jsdom has no layout and lacks these browser APIs:

- `ResizeObserver`: positioned overlays such as `Menu`, `Popover`, and
  `Select`, and `ScrollArea`.
- `IntersectionObserver`: `ScrollArea`.
- `matchMedia`: `useMediaQuery`, `useBreakpoint`, and `useBreakpointValue`.
- `scrollTo`: the `Combobox` list.

Solid 2 applies signal writes on its next flush. Flush after each event and
async wait so assertions see the updated DOM.

```ts
import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/dom';
import { flush } from 'solid-js';
import { vi } from 'vitest';

configure({
  /** Apply Solid's queued writes after each dispatched event. */
  eventWrapper(dispatch) {
    const result = dispatch();
    flush();
    return result;
  },
  /** Apply Solid's queued writes after each async wait. */
  async asyncWrapper(run) {
    const result = await run();
    flush();
    return result;
  },
});

/** Stand in for browser observers, which never fire in jsdom. */
class ObserverStub {
  /** Ignore observed elements because jsdom performs no layout. */
  observe(): void {}
  /** Ignore observed elements because jsdom performs no layout. */
  unobserve(): void {}
  /** Release nothing because nothing was observed. */
  disconnect(): void {}
  /** Report no pending intersections. */
  takeRecords(): [] {
    return [];
  }
}

/** Report every media query as unmatched, as `base` breakpoint values expect. */
function matchMediaStub(query: string): Partial<MediaQueryList> {
  return {
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
}

vi.stubGlobal('ResizeObserver', ObserverStub);
vi.stubGlobal('IntersectionObserver', ObserverStub);
vi.stubGlobal('matchMedia', vi.fn(matchMediaStub));
Element.prototype.scrollTo = vi.fn();
```

## Custom Render

Components need no provider. Write a custom render only to share providers,
such as a locale or a forced color mode.

```tsx
// testing/render.tsx
import { LocaleProvider, Theme } from '@leverui/components';
import { render as solidRender } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import type { JSX } from '@solidjs/web';

/** Wrap every test in the application's shared providers. */
function TestProviders(props: ParentProps): JSX.Element {
  return (
    <LocaleProvider locale="en-US">
      <Theme appearance="light">{props.children}</Theme>
    </LocaleProvider>
  );
}

/** Render a Solid component inside the shared test providers. */
export function render(ui: () => JSX.Element): ReturnType<typeof solidRender> {
  return solidRender(ui, { wrapper: TestProviders });
}
```

## Testing Components

Solid's `render` takes a function that returns the JSX.

```tsx
// button.test.tsx
import { Button } from '@leverui/components';
import { screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { render } from './testing/render';

test('renders a button', async () => {
  const onClick = vi.fn();
  render(() => <Button onClick={onClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button', { name: 'Click me' }));

  expect(onClick).toHaveBeenCalledOnce();
});
```

Interactive components start in a microtask after render, and overlay content
appears after the state change. Use the `findBy` queries, which wait.

```tsx
// dialog.test.tsx
import { Dialog, Portal } from '@leverui/components';
import { screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { render } from './testing/render';

test('opens a dialog', async () => {
  render(() => (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Account</Dialog.Title>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  ));

  await userEvent.click(screen.getByRole('button', { name: 'Open' }));

  expect(await screen.findByRole('dialog', { name: 'Account' })).toBeInTheDocument();
});
```
