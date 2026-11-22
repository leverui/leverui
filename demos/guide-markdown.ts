import type { DemoParameters } from './demo-types';

/** Mark a demo's guide description as Markdown so the site renders its paragraphs and lists. */
export function markdownGuide(parameters: DemoParameters | undefined): DemoParameters {
  return { ...parameters, guide: { ...parameters?.guide, descriptionFormat: 'markdown' } };
}
