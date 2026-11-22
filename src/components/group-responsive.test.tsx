import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Group } from '../index';

/** Keep the native group mounted while breakpoint selections change. */
function verifiesResponsiveAttributes(): void {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('vertical');
  const [grow, setGrow] = createSignal(false);

  /** Render breakpoint selections through live Solid props. */
  function Example(): JSX.Element {
    return (
      <>
        <Group
          data-testid="responsive-group"
          orientation={{ base: 'horizontal', md: orientation() }}
          grow={{ base: false, md: grow() }}
        >
          <span>First</span>
          <span>Last</span>
        </Group>
      </>
    );
  }

  render(
    /** Mount the example under Solid's tracked test root. */
    () => <Example />,
  );
  const group = screen.getByTestId('responsive-group');
  expect(group.getAttribute('data-orientation-md')).toBe('vertical');
  expect(group.getAttribute('data-grow-md')).toBe('false');

  setOrientation('horizontal');
  flush();
  setGrow(true);
  flush();
  expect(screen.getByTestId('responsive-group')).toBe(group);
  expect(group.getAttribute('data-orientation-md')).toBe('horizontal');
  expect(group.getAttribute('data-grow-md')).toBe('true');
}

it('updates responsive Group attributes without remounting', verifiesResponsiveAttributes);

/** Expose reversible responsive choices without a style runtime marker. */
function verifiesResponsiveJoinedLayout(): void {
  render(
    /** Mount authored joined, growth, and stacking selections. */
    () => (
      <>
        <Group
          data-testid="joined-group"
          attached={{ base: true, md: false }}
          orientation={{ base: 'horizontal', md: 'vertical' }}
          stacking={{ base: 'last-on-top', md: 'first-on-top' }}
        >
          Joined
        </Group>
        <Group data-testid="reset-group" grow={{ base: true, md: false }}>
          Reset
        </Group>
      </>
    ),
  );

  for (const id of ['joined-group', 'reset-group']) {
    expect(screen.getByTestId(id).hasAttribute('data-leverui-private-style-runtime')).toBe(false);
  }
  expect(screen.getByTestId('joined-group').getAttribute('data-joined-base')).toBe('horizontal');
  expect(screen.getByTestId('joined-group').getAttribute('data-joined-md')).toBe('none');
  expect(screen.getByTestId('joined-group').getAttribute('data-stacking-md')).toBe('first-on-top');
  expect(screen.getByTestId('reset-group').getAttribute('data-grow-md')).toBe('false');
}

it('exposes responsive Group choices through authored attributes', verifiesResponsiveJoinedLayout);
