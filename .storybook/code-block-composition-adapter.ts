import { createShikiAdapter } from '../src';

/** Load syntax support only when a consumer mounts the example. */
async function loadHighlighter() {
  const { createHighlighter } = await import('shiki');
  return createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: ['typescript', 'python'],
  });
}

export const codeCompositionAdapter = createShikiAdapter({
  load: loadHighlighter,
  theme: { dark: 'github-dark', light: 'github-light' },
});
