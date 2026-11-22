import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { ShareIcon, TrashIcon } from '@lucide/solid';
import { ActionBar, Button, Checkbox, CloseButton } from '../../src';

/** Show the controlled Action Bar when its selection checkbox is checked. */
export function ActionBarBasic(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  return (
    <>
      <Checkbox.Root
        onCheckedChange={
          /** Synchronize the checkbox's Boolean selection state. */
          (details) => setChecked(details.checked === true)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Show action bar</Checkbox.Label>
      </Checkbox.Root>
      <ActionBar.Root open={checked()}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content aria-label="Selection actions">
              <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
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
    </>
  );
}

/** Let the Action Bar close trigger clear the controlling checkbox. */
export function ActionBarWithCloseTrigger(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  return (
    <>
      <Checkbox.Root
        checked={checked()}
        onCheckedChange={
          /** Follow checkbox changes into the controlled bar. */
          (details) => setChecked(details.checked === true)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Show action bar</Checkbox.Label>
      </Checkbox.Root>
      <ActionBar.Root
        open={checked()}
        onOpenChange={
          /** Clear the selection when the bar dismisses itself. */
          (details) => setChecked(details.open)
        }
        closeOnInteractOutside={false}
      >
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content aria-label="Selection actions">
              <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                <TrashIcon /> Delete
              </Button>
              <Button variant="outline" size="sm">
                <ShareIcon /> Share
              </Button>
              <ActionBar.CloseTrigger
                asChild={
                  /** Give the close button the bar's dismissal props. */
                  (getProps) => <CloseButton {...getProps()} size="sm" />
                }
              />
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}
