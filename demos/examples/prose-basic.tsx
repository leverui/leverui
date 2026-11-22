import { type JSX } from '@solidjs/web';
import { Prose } from '../../src';

/** Show the prose example with semantic HTML. */
export function ProseBasic(): JSX.Element {
  return (
    <Prose>
      <h1>Heading level 1</h1>
      <h2>Heading level 2</h2>
      <h3>Heading level 3</h3>
      <h4>Heading level 4</h4>

      <h4>
        Heading level 4 with <code>code</code>
      </h4>

      <p>
        Good notes are short and easy to find again. Write each note as if someone else will read
        it, because you will have forgotten the details by the time you open it again. Start with
        one line that says what the note is about, then add the details underneath. Keep one idea in
        each note, and link two notes together when one idea builds on the other. To reuse a line
        somewhere else, select it first. Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
      </p>

      <p>
        Go through your notes once a week. Delete the ones you no longer need, and merge the ones
        that say the same thing. A small set of notes you trust is more useful than a large pile you
        never open.
      </p>

      <hr />

      <p>
        Tags help when a note fits in more than one place. Use a few broad tags, such as work, home
        and reading, so you do not have to remember dozens of names later.
      </p>
    </Prose>
  );
}
