import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  untrack,
  type Accessor,
} from 'solid-js';
import { useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { CodeBlockAdapter, CodeBlockHighlighter } from './code-block-types';

export interface CodeBlockAdapterProviderProps {
  value: CodeBlockAdapter;
  children: JSX.Element;
}

interface AdapterSnapshot {
  adapter: CodeBlockAdapter;
  context: unknown;
}

interface AdapterLoadError {
  adapter: CodeBlockAdapter;
  error: unknown;
}

/** Preserve readable code until an optional highlighter finishes loading. */
function highlightPlainText({ code }: { code: string }): { code: string; highlighted: false } {
  return { code, highlighted: false };
}

export const plainTextAdapter: CodeBlockAdapter = {
  /** Return unstyled code without loading a syntax engine. */
  getHighlighter() {
    return highlightPlainText;
  },
};

const AdapterContext = createContext<Accessor<CodeBlockHighlighter>>(
  /** Use readable plain text when no adapter provider is present. */
  () => highlightPlainText,
);

/** Load and dispose one highlighter context for the nearest Code Block. */
export function CodeBlockAdapterProvider(props: CodeBlockAdapterProviderProps): JSX.Element {
  const initialAdapter = untrack(
    /** Read the synchronous highlighter once for server markup. */
    () => props.value,
  );
  const [snapshot, setSnapshot] = createSignal<AdapterSnapshot>({
    adapter: initialAdapter,
    context: initialAdapter.loadContextSync?.() ?? null,
  });
  const [loadError, setLoadError] = createSignal<AdapterLoadError>();

  createEffect(
    /** Track the configured adapter. */
    () => props.value,
    /** Load optional async context when the adapter changes. */
    (adapter) => {
      let active = untrack(snapshot);
      if (adapter !== active.adapter) {
        active = { adapter, context: adapter.loadContextSync?.() ?? null };
        setSnapshot(active);
        setLoadError(undefined);
      }
      let held = active.context;
      let mounted = true;
      const released = new Set<unknown>();

      /** Release each context once, including one returned by both loaders. */
      function release(context: unknown): void {
        if (context == null || released.has(context)) return;
        released.add(context);
        adapter.unloadContext?.(context);
      }

      void adapter.loadContext?.().then(
        /** Install the loaded highlighter unless this provider has changed. */
        (loaded) => {
          if (!mounted) {
            release(loaded);
            return;
          }
          if (held !== loaded) release(held);
          held = loaded;
          setSnapshot({ adapter, context: loaded });
        },
        /** Surface adapter load failures to the nearest Solid error boundary. */
        (error: unknown) => {
          if (mounted) setLoadError({ adapter, error });
        },
      );
      return (
        /** Release the current highlighter on unmount or adapter change. */
        () => {
          mounted = false;
          release(held);
        }
      );
    },
  );

  const highlighter = createMemo(
    /** Keep highlighted output reactive to async loads and adapter changes. */
    () => {
      const adapter = props.value;
      const active = snapshot();
      if (adapter !== active.adapter) return highlightPlainText;
      const failure = loadError();
      if (failure?.adapter === adapter) throw failure.error;
      return adapter.getHighlighter(active.context);
    },
  );
  return <AdapterContext value={highlighter}>{props.children}</AdapterContext>;
}

/** Read the nearest highlighter or the built-in plain-text fallback. */
export function useCodeBlockHighlighter(): Accessor<CodeBlockHighlighter> {
  return useOptionalContext(AdapterContext);
}
