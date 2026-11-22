import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { ShareIcon, TrashIcon } from '@lucide/solid';
import { ActionBar, Button, SegmentGroup, Text, VStack } from '../../src';

/** Let the selection bar move between the three bottom alignments. */
export function ActionBarPlacement(): JSX.Element {
  const [placement, setPlacement] = createSignal<'bottom' | 'bottom-start' | 'bottom-end'>(
    'bottom',
  );
  const [open, setOpen] = createSignal(false);

  return (
    <VStack gap="6" align="flex-start">
      <VStack gap="3" align="flex-start">
        <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>Placement:</Text>
        <SegmentGroup.Root
          size="sm"
          value={placement()}
          onValueChange={
            /** Follow a valid segment selection into the controlled Action Bar. */
            (details) => {
              const value = details.value;
              if (value === 'bottom' || value === 'bottom-start' || value === 'bottom-end') {
                setPlacement(value);
              }
            }
          }
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            items={[
              { value: 'bottom-start', label: 'Bottom start' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'bottom-end', label: 'Bottom end' },
            ]}
          />
        </SegmentGroup.Root>
      </VStack>
      <Button
        onClick={
          /** Toggle the Action Bar without changing its placement. */
          () => setOpen(!open())
        }
      >
        {open() ? 'Hide' : 'Show'} action bar
      </Button>
      <ActionBar.Root open={open()} placement={placement()}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content aria-label="Selection actions">
              <ActionBar.SelectionTrigger>3 selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                <TrashIcon /> Delete
              </Button>
              <Button variant="outline" size="sm">
                <ShareIcon /> Share
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </VStack>
  );
}
