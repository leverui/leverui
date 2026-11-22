import { createEffect, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ChevronDownIcon, ChevronRightIcon } from '@lucide/solid';
import { Box, Button, Collapsible, Stack, Text } from '../../src';
import { CollapsibleParagraphs } from './collapsible-copy';

/** Preserve a 100px preview while the long disclosure is closed. */
export function CollapsiblePartialHeight(): JSX.Element {
  return (
    <Collapsible.Root collapsedHeight="100px">
      <Collapsible.Content class="collapsible-example-preview-content">
        <Stack class="collapsible-example-panel collapsible-example-rounded-panel">
          <CollapsibleParagraphs paragraphs={1} />
          <CollapsibleParagraphs paragraphs={1} />
        </Stack>
      </Collapsible.Content>
      <Collapsible.Trigger
        class="collapsible-example-preview-trigger"
        asChild={
          /** Keep the trigger contract on the styled button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              <Collapsible.Context>
                {
                  /** Describe the current disclosure action. */
                  (api) => <span>{api().open ? 'Show less' : 'Show more'}</span>
                }
              </Collapsible.Context>
              <Collapsible.Indicator class="collapsible-example-down-indicator">
                <ChevronDownIcon />
              </Collapsible.Indicator>
            </Button>
          )
        }
      />
    </Collapsible.Root>
  );
}

/** Start open with the chevron and two paragraphs. */
export function CollapsibleInitialOpen(): JSX.Element {
  return (
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger class="collapsible-example-trigger collapsible-example-inline-trigger">
        <Collapsible.Indicator class="collapsible-example-right-indicator">
          <ChevronRightIcon />
        </Collapsible.Indicator>
        Toggle
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack class="collapsible-example-panel">
          <CollapsibleParagraphs paragraphs={2} />
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Control a disclosure from its caller-owned store. */
export function CollapsibleWithStore(): JSX.Element {
  const collapsible = Collapsible.useCollapsible();

  return (
    <Stack gap="4" align="flex-start">
      <Box class="collapsible-example-state">
        State: {collapsible().visible ? 'Expanded' : 'Collapsed'}
      </Box>
      <Button
        size="sm"
        variant="subtle"
        onClick={
          /** Toggle the same store supplied to RootProvider. */
          () => collapsible().setOpen(!collapsible().open)
        }
      >
        Toggle {collapsible().open ? <ChevronRightIcon /> : <ChevronDownIcon />}
      </Button>
      <Collapsible.RootProvider value={collapsible}>
        <Collapsible.Content>
          <Box class="collapsible-example-panel collapsible-example-rounded-panel">
            Using the <code>useCollapsible</code> hook with <code>RootProvider</code> lets you read
            the collapsible's state and open or close it from anywhere in your component.
          </Box>
        </Collapsible.Content>
      </Collapsible.RootProvider>
    </Stack>
  );
}

/** Count only while the Solid disclosure is open, preserving the last count. */
function EffectCounter(props: { open: () => boolean }): JSX.Element {
  const [count, setCount] = createSignal(0);

  createEffect(
    /** Track whether the disclosure is open. */
    () => props.open(),
    /** Pause and resume the interval as disclosure visibility changes. */
    (open) => {
      if (!open) return;
      const interval = window.setInterval(
        /** Advance the visible effect count once per second. */
        () =>
          setCount(
            /** Increment without discarding the prior count. */
            (current) => current + 1,
          ),
        1000,
      );
      return (
        /** Release the interval on collapse or unmount. */
        () => window.clearInterval(interval)
      );
    },
  );

  return <Text>Effect ticks: {count()}</Text>;
}

/** Demonstrate the paused counter with Solid visibility state. */
export function CollapsibleWithHideMode(): JSX.Element {
  return (
    <Collapsible.Root defaultOpen>
      <Stack align="flex-start" gap="3">
        <Collapsible.Trigger
          asChild={
            /** Keep the trigger behavior on the outlined button. */
            (getProps) => (
              <Button {...getProps()} size="sm" variant="outline">
                Toggle content
              </Button>
            )
          }
        />
        <Text textStyle="sm" class="collapsible-example-description">
          Collapse this for a few seconds, then reopen it. The counter pauses while collapsed and
          resumes from where it stopped.
        </Text>
        <Collapsible.Content class="collapsible-example-full-content">
          <Box class="collapsible-example-panel collapsible-example-rounded-panel">
            <Collapsible.Context>
              {
                /** Read current visibility without remounting the counter. */
                (api) => (
                  <EffectCounter
                    open={
                      /** Follow the current open state. */
                      () => api().open
                    }
                  />
                )
              }
            </Collapsible.Context>
          </Box>
        </Collapsible.Content>
      </Stack>
    </Collapsible.Root>
  );
}
