import { render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test, vi } from 'vitest';
import { CodeBlock, type CodeBlockAdapter } from '../index';

interface Engine {
  name: string;
}

/** Create a strict adapter that rejects another adapter's syntax context. */
function makeAdapter(name: string, unloadContext: (context: unknown) => void): CodeBlockAdapter {
  const engine: Engine = { name };
  return {
    /** Supply this adapter's engine during the initial client pass. */
    loadContextSync() {
      return engine;
    },
    unloadContext,
    /** Bind a highlighter only to the matching engine. */
    getHighlighter(context) {
      if (context !== engine) throw new Error(`Mismatched ${name} engine`);
      /** Mark output with the engine that actually highlighted it. */
      function highlight({ code }: { code: string }): { code: string; highlighted: true } {
        return { code: `<span data-engine="${name}">${code}</span>`, highlighted: true };
      }
      return highlight;
    },
  };
}

/** Switch engines without passing the previous context to the new adapter. */
async function verifiesAdapterReplacement(): Promise<void> {
  const unloadFirst = vi.fn();
  const unloadSecond = vi.fn();
  const first = makeAdapter('first', unloadFirst);
  const second = makeAdapter('second', unloadSecond);
  const [adapter, setAdapter] = createSignal<CodeBlockAdapter>(first);

  /** Keep one native code node mounted while its provider changes. */
  function Example(): JSX.Element {
    return (
      <>
        <CodeBlock.AdapterProvider value={adapter()}>
          <CodeBlock.Root code="ready">
            <CodeBlock.CodeText data-testid="code" />
          </CodeBlock.Root>
        </CodeBlock.AdapterProvider>
      </>
    );
  }

  const view = render(
    /** Mount the first engine before swapping the reactive adapter. */
    () => <Example />,
  );
  const code = screen.getByTestId('code');
  expect(code.querySelector('[data-engine="first"]')?.textContent).toBe('ready');
  expect(
    /** Replace the adapter while retaining the mounted code element. */
    () => setAdapter(second),
  ).not.toThrow();
  await waitFor(
    /** Wait for the replacement engine to highlight the same source node. */
    () => expect(code.querySelector('[data-engine="second"]')?.textContent).toBe('ready'),
  );
  expect(screen.getByTestId('code')).toBe(code);
  expect(unloadFirst).toHaveBeenCalledOnce();
  view.unmount();
  expect(unloadSecond).toHaveBeenCalledOnce();
}

test('adapter replacement never reuses the previous context', verifiesAdapterReplacement);

/** Unmounting before async completion must dispose a shared engine once. */
async function verifiesLateLoadDisposal(): Promise<void> {
  const engine: Engine = { name: 'shared' };
  let finishLoad: ((value: Engine) => void) | undefined;
  const pending = new Promise<Engine>(
    /** Retain the pending loader's resolver until after unmount. */
    (resolve) => {
      finishLoad = resolve;
    },
  );
  const unloadContext = vi.fn();
  const adapter: CodeBlockAdapter = {
    /** Return the shared engine on the synchronous path. */
    loadContextSync() {
      return engine;
    },
    /** Resolve the same engine after the provider is gone. */
    loadContext() {
      return pending;
    },
    unloadContext,
    /** Keep rendered source stable while testing the loader lifecycle. */
    getHighlighter() {
      /** Return readable source without changing its markup. */
      function highlight({ code }: { code: string }): { code: string; highlighted: false } {
        return { code, highlighted: false };
      }
      return highlight;
    },
  };
  const view = render(
    /** Mount a provider whose async loader is still pending. */
    () => <CodeBlock.AdapterProvider value={adapter}>Ready</CodeBlock.AdapterProvider>,
  );
  view.unmount();
  finishLoad?.(engine);
  await pending;
  await Promise.resolve();
  expect(unloadContext).toHaveBeenCalledOnce();
  expect(unloadContext).toHaveBeenCalledWith(engine);
}

test('late adapter completion never disposes the same engine twice', verifiesLateLoadDisposal);
