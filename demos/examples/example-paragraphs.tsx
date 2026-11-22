import { Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { exampleParagraphText } from './example-paragraph-text';

/** Render the fixed paragraphs shown by the ScrollArea examples. */
export function ExampleParagraphs(props: { paragraphs: number }): JSX.Element {
  return (
    <>
      <Repeat count={props.paragraphs}>{() => <p>{exampleParagraphText}</p>}</Repeat>
    </>
  );
}
