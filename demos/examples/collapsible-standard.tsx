import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Collapsible, Stack } from '../../src';
import { CollapsibleIntroduction } from './collapsible-copy';

/** Show the default collapsed disclosure and the introduction. */
export function CollapsibleBasic(): JSX.Element {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger class="collapsible-example-trigger">
        Toggle collapsible
      </Collapsible.Trigger>
      <Collapsible.Content>
        <CollapsibleIntroduction />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Unmount disclosure content each time it closes. */
export function CollapsibleLazyMounted(): JSX.Element {
  return (
    <Collapsible.Root unmountOnExit>
      <Collapsible.Trigger class="collapsible-example-trigger">
        Toggle (unmount on exit)
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box class="collapsible-example-panel">
          If you inspect the DOM, you will see that this content is removed when the collapsible
          closes. That keeps the page light when you have a lot of collapsible content.
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Keep the disabled disclosure closed when its trigger is clicked. */
export function CollapsibleWithDisabled(): JSX.Element {
  return (
    <Collapsible.Root disabled>
      <Collapsible.Trigger class="collapsible-example-disabled-trigger">
        Toggle (disabled)
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box class="collapsible-example-panel">
          You cannot open this content because the collapsible has the <code>disabled</code> prop.
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Reflect controlled disclosure state in the status label. */
export function CollapsibleControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);

  return (
    <Stack gap="4">
      <Box class="collapsible-example-state">Status: {open() ? 'Open' : 'Closed'}</Box>
      <Collapsible.Root
        open={open()}
        onOpenChange={
          /** Sync the open event with the controlled signal. */
          (details) => setOpen(details.open)
        }
      >
        <Collapsible.Trigger class="collapsible-example-trigger">
          Toggle collapsible
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Box class="collapsible-example-panel">
            The open state of this collapsible is kept outside the component. Click the trigger to
            change it, and the status above updates to match.
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
}
