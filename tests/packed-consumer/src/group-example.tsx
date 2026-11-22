import { Button, Group } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exclude the marked separator from installed Group item positions. */
function skipSeparator(child: Element): boolean {
  return child.getAttribute('data-separator') === 'yes';
}

/** Exercise installed Group layout, child indexing, and live orientation. */
export function PackedGroup(): JSX.Element {
  const [vertical, setVertical] = createSignal(false);

  /** Record the native section supplied through the package declaration. */
  function markSection(element: HTMLElement): void {
    element.dataset.groupRef = element.tagName.toLowerCase();
  }

  /** Change orientation without replacing the grouped button. */
  function toggleOrientation(): void {
    setVertical(!vertical());
  }

  return (
    <Group
      as="section"
      id="packed-group"
      ref={markSection}
      attached
      stacking="first-on-top"
      orientation={vertical() ? 'vertical' : 'horizontal'}
      skip={skipSeparator}
    >
      <Button id="packed-group-first" variant="outline" onClick={toggleOrientation}>
        <span id="packed-group-child">Change group</span>
      </Button>
      <span id="packed-group-separator" data-separator="yes">
        |
      </span>
      <Button id="packed-group-last" variant="outline">
        Last
      </Button>
    </Group>
  );
}
