import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { CheckboxGroup } from '../index';

afterEach(cleanup);

/** Verify the group keeps native customization without a style provider. */
function verifiesNativeGroup(): void {
  let groupNode: Element | undefined;
  const [className, setClassName] = createSignal('consumer-group');

  /** Capture the actual native group element. */
  function captureGroup(element: Element): void {
    groupNode = element;
  }

  /** Render the group without Lever UI's style provider. */
  function Example(): JSX.Element {
    return (
      <CheckboxGroup
        as="section"
        aria-label="Choices"
        data-testid="group"
        class={className()}
        style={{ gap: '2rem' }}
        ref={captureGroup}
      >
        <span>Choice</span>
      </CheckboxGroup>
    );
  }

  const mounted = render(Example);
  const group = screen.getByRole('group', { name: 'Choices' });
  expect(group.tagName).toBe('SECTION');
  expect(groupNode).toBe(group);
  expect(group.className).toContain('lui-checkbox-group');
  expect(group.className).toContain('consumer-group');
  expect((group as HTMLElement).style.gap).toBe('2rem');
  expect(mounted.container.querySelector('style')).toBeNull();
  setClassName('changed-group');
  flush();
  expect(group.className).toContain('changed-group');
  expect(group.className).not.toContain('consumer-group');
}

it('renders a native CSS-backed group without a provider', verifiesNativeGroup);

/** Verify unstyled groups expose a stable CSS opt-out hook. */
function verifiesUnstyledGroup(): void {
  render(
    /** Keep the stable class while disabling only the authored default. */
    () => (
      <CheckboxGroup aria-label="Choices" data-testid="group" unstyled>
        Choice
      </CheckboxGroup>
    ),
  );
  const group = screen.getByTestId('group');
  expect(group.className).toContain('lui-checkbox-group');
  expect(group.hasAttribute('data-unstyled')).toBe(true);
}

it('marks the authored default as unstyled when requested', verifiesUnstyledGroup);
