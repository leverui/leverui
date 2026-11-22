import type { HLJSApi } from 'highlight.js';
import core from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import type { CodeBlockAdapter, createHighlightJsAdapter } from '../src';

/** Create an isolated Highlight.js engine for one server or browser render. */
function loadHighlighter(): HLJSApi {
  const highlighter = core.newInstance();
  highlighter.registerLanguage('tsx', typescript);
  return highlighter;
}

/** Supply synchronous highlighting so hydration starts from matching markup. */
export function createOverflowHydrationAdapter(
  factory: typeof createHighlightJsAdapter,
): CodeBlockAdapter {
  let highlighter: HLJSApi | undefined;

  /** Reuse one engine across the synchronous and asynchronous adapter paths. */
  function loadSync(): HLJSApi {
    highlighter ??= loadHighlighter();
    return highlighter;
  }

  /** Fulfill the public adapter's asynchronous loader after browser mount. */
  async function load(): Promise<HLJSApi> {
    return loadSync();
  }

  return factory({ load, loadSync });
}
