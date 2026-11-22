import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Stack, Textarea } from '../../src';

/** Show the default multiline input. */
export function TextareaBasic(): JSX.Element {
  return <Textarea placeholder="Comment..." />;
}

/** Show the three authored variants. */
export function TextareaWithVariants(): JSX.Element {
  return (
    <Stack gap="4">
      <Textarea variant="outline" placeholder="outline" />
      <Textarea variant="subtle" placeholder="subtle" />
      <Textarea variant="flushed" placeholder="flushed" />
    </Stack>
  );
}

/** Show the five authored sizes. */
export function TextareaWithSizes(): JSX.Element {
  return (
    <Stack gap="4">
      <Textarea size="xs" placeholder="Extra small size" />
      <Textarea size="sm" placeholder="Small size" />
      <Textarea size="md" placeholder="Medium size" />
      <Textarea size="lg" placeholder="Large size" />
      <Textarea size="xl" placeholder="Extra large size" />
    </Stack>
  );
}

/** Grow the textarea as the user enters multiple lines. */
export function TextareaWithAutoresize(): JSX.Element {
  return <Textarea autoresize />;
}

/** Limit an auto-growing textarea to the four visible rows. */
export function TextareaWithAutoresizeMaxRows(): JSX.Element {
  return <Textarea placeholder="Limits to 4 rows" autoresize style={{ 'max-height': '5lh' }} />;
}

/** Compare all four native resize directions. */
export function TextareaWithResize(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '250px' }}>
      <For each={['none', 'vertical', 'horizontal', 'both'] as const}>
        {
          /** Render a textarea with one native resize setting. */
          (resize) => <Textarea style={{ resize }} placeholder="Write a comment…" />
        }
      </For>
    </Stack>
  );
}
