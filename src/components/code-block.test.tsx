import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it, vi } from 'vitest';
import { CodeBlock, createShikiAdapter, type UseCodeBlockContext } from '../index';

const source = '\n  const ready = true\n  console.log(ready)\n  return ready\n';

/** Verify native code semantics and root metadata without a syntax adapter. */
function verifiesPlainText(): void {
  render(
    /** Mount a collapsible plain-text block through the public namespace. */
    () => (
      <>
        <CodeBlock.Root
          code={source}
          language="tsx"
          maxLines={2}
          meta={{ showLineNumbers: true, wordWrap: true, highlightLines: [2] }}
          data-testid="root"
        >
          <CodeBlock.Content data-testid="content">
            <CodeBlock.Code data-testid="pre">
              <CodeBlock.CodeText data-testid="code" />
            </CodeBlock.Code>
            <CodeBlock.Overlay data-testid="overlay" />
          </CodeBlock.Content>
          <CodeBlock.CollapseTrigger data-testid="toggle">
            <CodeBlock.CollapseText />
          </CodeBlock.CollapseTrigger>
        </CodeBlock.Root>
      </>
    ),
  );

  expect(screen.getByTestId('root').tagName).toBe('DIV');
  expect(screen.getByTestId('root').hasAttribute('data-has-line-numbers')).toBe(true);
  expect(screen.getByTestId('root').getAttribute('data-leverui-color-mode')).toBe('dark');
  expect(screen.getByTestId('code').tagName).toBe('CODE');
  expect(screen.getByTestId('code').hasAttribute('data-plaintext')).toBe(true);
  expect(screen.getByTestId('code').hasAttribute('data-word-wrap')).toBe(true);
  expect(screen.getByTestId('code').textContent).toBe(source.trim());
  expect(screen.getByTestId('pre').tagName).toBe('PRE');
  expect(screen.getByTestId('pre').getAttribute('tabindex')).toBe('0');
  expect(screen.getByTestId('content').getAttribute('aria-expanded')).toBe('false');
  expect(screen.getByTestId('toggle').getAttribute('aria-expanded')).toBe('false');
  expect(screen.getByTestId('toggle').getAttribute('aria-controls')).toBe(
    screen.getByTestId('content').id,
  );
  expect(screen.getByTestId('overlay').hasAttribute('data-expanded')).toBe(false);
  fireEvent.click(screen.getByTestId('toggle'));
  expect(screen.getByTestId('content').getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByTestId('overlay').hasAttribute('data-expanded')).toBe(true);
  expect(screen.getByTestId('toggle').getAttribute('aria-label')).toBe('Collapse code block');
}

it('renders native, collapsible plain text with source metadata', verifiesPlainText);

/** Verify the supplied adapter can replace plain text with highlighted markup. */
function verifiesSyncAdapter(): void {
  const adapter = createShikiAdapter({
    /** Load the same highlighter asynchronously when the browser mounts. */
    async load() {
      return highlighter;
    },
    /** Produce highlighted markup during server and initial client renders. */
    loadSync() {
      return highlighter;
    },
    theme: { dark: 'night', light: 'day' },
  });
  const highlighter = {
    /** Wrap escaped fixture source in Shiki-shaped native elements. */
    codeToHtml(code: string): string {
      return `<pre><code><span data-line="1">${code}</span></code></pre>`;
    },
  };
  render(
    /** Mount a highlighter and a light Code Block scope together. */
    () => (
      <>
        <CodeBlock.AdapterProvider value={adapter}>
          <CodeBlock.Root code="const ready = true" meta={{ colorScheme: 'light' }}>
            <CodeBlock.Code>
              <CodeBlock.CodeText data-testid="highlighted" />
            </CodeBlock.Code>
          </CodeBlock.Root>
        </CodeBlock.AdapterProvider>
      </>
    ),
  );
  const code = screen.getByTestId('highlighted');
  expect(code.hasAttribute('data-plaintext')).toBe(false);
  expect(code.querySelector('[data-line="1"]')?.textContent).toBe('const ready = true');
}

it('uses a synchronous consumer highlighter when supplied', verifiesSyncAdapter);

/** Verify asynchronous syntax loading replaces plain text and releases its context. */
async function verifiesAsyncAdapter(): Promise<void> {
  const highlighter = { ready: true };
  let resolveLoad: ((value: typeof highlighter) => void) | undefined;
  const loading = new Promise<typeof highlighter>(
    /** Capture the syntax engine's deferred load completion. */
    (resolve) => {
      resolveLoad = resolve;
    },
  );
  const unloadContext = vi.fn();
  const adapter = {
    /** Delay the syntax engine until the test resolves it. */
    loadContext() {
      return loading;
    },
    unloadContext,
    /** Select plain source or trusted fixture HTML from the loaded context. */
    getHighlighter(context: unknown) {
      /** Mark syntax only once the async context is available. */
      function highlight({ code }: { code: string }): { code: string; highlighted: boolean } {
        return context === highlighter
          ? { code: `<span data-syntax>${code}</span>`, highlighted: true }
          : { code, highlighted: false };
      }
      return highlight;
    },
  };
  const view = render(
    /** Mount the provider before its asynchronous syntax context resolves. */
    () => (
      <>
        <CodeBlock.AdapterProvider value={adapter}>
          <CodeBlock.Root code="ready">
            <CodeBlock.CodeText data-testid="async-code" />
          </CodeBlock.Root>
        </CodeBlock.AdapterProvider>
      </>
    ),
  );
  const code = screen.getByTestId('async-code');
  expect(code.hasAttribute('data-plaintext')).toBe(true);
  resolveLoad?.(highlighter);
  await waitFor(
    /** Wait for the same native node to receive highlighted markup. */
    () => expect(code.querySelector('[data-syntax]')?.textContent).toBe('ready'),
  );
  expect(screen.getByTestId('async-code')).toBe(code);
  expect(code.hasAttribute('data-plaintext')).toBe(false);
  view.unmount();
  expect(unloadContext).toHaveBeenCalledOnce();
  expect(unloadContext).toHaveBeenCalledWith(highlighter);
}

it('loads and disposes an asynchronous syntax adapter', verifiesAsyncAdapter);

/** Verify a mounted block follows code and inherited size updates. */
function verifiesReactiveBlock(): void {
  const [long, setLong] = createSignal(false);

  /** Keep the same native Code Block root mounted while source changes. */
  function Example(): JSX.Element {
    /** Display the context source beside the native code element. */
    function renderSourceState(context: UseCodeBlockContext): JSX.Element {
      return <span data-testid="source-state">{context.code()}</span>;
    }

    return (
      <>
        <CodeBlock.PropsProvider value={{ size: long() ? 'lg' : 'sm' }}>
          <CodeBlock.Root
            code={long() ? 'one\ntwo\nthree' : 'one'}
            maxLines={2}
            data-testid="reactive-root"
          >
            <CodeBlock.Context>{renderSourceState}</CodeBlock.Context>
            <CodeBlock.Content data-testid="reactive-content">
              <CodeBlock.CodeText data-testid="reactive-code" />
            </CodeBlock.Content>
          </CodeBlock.Root>
        </CodeBlock.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the signal-bound Code Block once. */
    () => <Example />,
  );
  const code = screen.getByTestId('reactive-code');
  expect(code.textContent).toBe('one');
  expect(screen.getByTestId('reactive-content').getAttribute('aria-expanded')).toBe('true');
  setLong(true);
  flush();
  expect(screen.getByTestId('reactive-code')).toBe(code);
  expect(screen.getByTestId('source-state').textContent).toBe('one\ntwo\nthree');
  expect(code.textContent).toBe('one\ntwo\nthree');
  expect(screen.getByTestId('reactive-content').getAttribute('aria-expanded')).toBe('true');
}

it('reacts to source and inherited recipe updates', verifiesReactiveBlock);
