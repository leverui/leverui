import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Prose, Stack, Text } from '../../src';

/** Compare the two Prose typography scales. */
export function ProseWithSizes(): JSX.Element {
  return (
    <Stack gap="10">
      <For each={['md', 'lg'] as const}>
        {
          /** Render the sample article at one size. */
          (size) => (
            <Stack>
              <Text>size: {size}</Text>
              <Prose size={size}>
                <h1>Heading level 1</h1>
                <h2>Heading level 2</h2>
                <h3>Heading level 3</h3>
                <h4>Heading level 4</h4>

                <h4>
                  Heading level 4 with <code>code</code>
                </h4>

                <p>
                  Good notes are short and easy to find again. Write each note as if someone else
                  will read it, because you will have forgotten the details by the time you open it
                  again. Start with one line that says what the note is about, then add the details
                  underneath. Keep one idea in each note, and link two notes together when one idea
                  builds on the other. To reuse a line somewhere else, select it first. Press{' '}
                  <kbd>Ctrl</kbd> +<kbd>C</kbd> to copy
                </p>
              </Prose>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}
