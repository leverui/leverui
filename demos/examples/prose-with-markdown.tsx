import { type JSX } from '@solidjs/web';
import { micromark } from 'micromark';
import { Prose } from '../../src';

const markdown = `
## Heading

This text comes from a Markdown string. [Read the docs](https://leverui.com) to learn more.

- First item
- Second item
- Third item
- Fourth item

[Lever UI home page](https://leverui.com)
`;

/** Render the Markdown example as semantic HTML inside Prose. */
export function ProseWithMarkdown(): JSX.Element {
  // eslint-disable-next-line solid/no-innerhtml -- fixed Markdown; micromark escapes raw HTML.
  return <Prose style={{ 'margin-inline': 'auto' }} innerHTML={micromark(markdown)} />;
}
