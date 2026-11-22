import { createHighlightJsAdapter, createShikiAdapter } from '../../src';

/** Load the languages and both GitHub color schemes on demand. */
async function loadShikiHighlighter() {
  const { createHighlighter } = await import('shiki');
  return createHighlighter({
    langs: ['tsx', 'typescript', 'javascript', 'python', 'java', 'scss', 'html', 'bash', 'json'],
    themes: ['github-dark', 'github-light'],
  });
}

export const referenceShikiAdapter = createShikiAdapter({
  load: loadShikiHighlighter,
  theme: { dark: 'github-dark', light: 'github-light' },
});

/** Load Highlight.js with the TSX and HTML grammars. */
async function loadHighlightJs() {
  const [{ default: highlighter }, { default: typescript }, { default: xml }] = await Promise.all([
    import('highlight.js/lib/core'),
    import('highlight.js/lib/languages/typescript'),
    import('highlight.js/lib/languages/xml'),
  ]);
  highlighter.registerLanguage('tsx', typescript);
  highlighter.registerLanguage('html', xml);
  return highlighter;
}

export const referenceHighlightJsAdapter = createHighlightJsAdapter({
  load: loadHighlightJs,
});
