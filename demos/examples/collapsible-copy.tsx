import { Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box } from '../../src';

const paragraph =
  'A collapsible hides content until someone asks for it. Use one when a page has details that only some readers need, such as delivery terms, a long answer to a common question, or the full text of a review. The trigger says what is inside, and the content opens in place so nobody loses their spot on the page. When the content is long, you can keep the first few lines visible as a preview and let people open the rest.';

/** Render the repeated sample paragraphs. */
export function CollapsibleParagraphs(props: { paragraphs: number }): JSX.Element {
  return <Repeat count={props.paragraphs}>{() => <p>{paragraph}</p>}</Repeat>;
}

/** Render the introductory Lever UI copy. */
export function CollapsibleIntroduction(): JSX.Element {
  return (
    <Box class="collapsible-example-panel">
      <strong>Lever UI</strong> is a set of ready-made components for SolidJS apps. Each one comes
      with default styles, keyboard support, and accessible markup, so you can spend your time on
      your product and not on rebuilding buttons and menus.
      <br />
      <br />
      Use the components as they are, or restyle them with your own CSS. You can start with one
      component and add more of <strong>Lever UI</strong> as your app grows.
    </Box>
  );
}
