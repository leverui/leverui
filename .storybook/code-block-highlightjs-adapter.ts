import type { HLJSApi } from 'highlight.js';
import { createHighlightJsAdapter } from '../src';

/** Load a private Highlight.js instance with only the example's languages. */
async function loadHighlightJs(): Promise<HLJSApi> {
  const [{ default: core }, { default: typescript }, { default: xml }] = await Promise.all([
    import('highlight.js/lib/core'),
    import('highlight.js/lib/languages/typescript'),
    import('highlight.js/lib/languages/xml'),
  ]);
  const highlighter = core.newInstance();
  highlighter.registerLanguage('tsx', typescript);
  highlighter.registerLanguage('html', xml);
  return highlighter;
}

export const highlightJsAdapter = createHighlightJsAdapter({ load: loadHighlightJs });
