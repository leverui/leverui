import { type JSX } from '@solidjs/web';
import { Prose } from '../../src';

/** Show the prose example with semantic HTML. */
export function ProseWithBlockquote(): JSX.Element {
  return (
    <Prose>
      <h3>Blockquotes</h3>
      <blockquote>A short quote fits on one line.</blockquote>
      <p>A quote can also run over several lines:</p>
      <blockquote>
        Write each note as if someone else will read it. Start with one line that says what the note
        is about, then add the details underneath. If a note grows longer than one screen, split it
        into two.
      </blockquote>
      <p>
        Prose also styles <strong>strong</strong>, <b>b</b> and <em>em</em> text, and code blocks
        too.
      </p>
    </Prose>
  );
}
