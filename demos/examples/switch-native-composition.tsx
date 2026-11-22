import { type JSX } from '@solidjs/web';
import { Switch } from '../../src';

/** Show selected native tags and refs without changing the machine. */
export function SwitchNativeCompositionExample(): JSX.Element {
  /** Mark the selected root after its native ref is forwarded. */
  function markRoot(element: HTMLLabelElement): void {
    element.dataset.rootRef = 'true';
  }

  /** Mark the selected control after its native ref is forwarded. */
  function markControl(element: HTMLDivElement): void {
    element.dataset.controlRef = 'true';
  }

  return (
    <>
      <Switch.Root as="label" ref={markRoot} data-testid="switch-native-root" size="lg">
        <Switch.HiddenInput aria-label="Native selection" />
        <Switch.Control as="div" ref={markControl} data-testid="switch-native-control" />
        <Switch.Label>Native selection</Switch.Label>
      </Switch.Root>
    </>
  );
}
