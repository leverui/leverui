import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { RatingGroup, useRatingGroup } from '../index';

afterEach(cleanup);

/** Keep inherited native appearance reactive without replacing an external machine. */
function verifiesExternalProviderDefaults(): void {
  /** Own selection in the primitive while provider defaults own the root appearance. */
  function Example(): JSX.Element {
    const rating = useRatingGroup({ name: 'score', defaultValue: 1 });
    const [color, setColor] = createSignal('rgb(1, 2, 3)');

    /** Change only the inherited native root style. */
    function changeColor(): void {
      setColor('rgb(4, 5, 6)');
      flush();
    }

    return (
      <>
        <button type="button" onClick={changeColor}>
          Change color
        </button>
        <RatingGroup.PropsProvider
          value={
            /** Preserve full root defaults while the external machine value wins. */
            () => ({ value: 5, class: 'inherited-rating', style: { color: color() } })
          }
        >
          <RatingGroup.RootProvider value={rating}>
            <RatingGroup.Control />
          </RatingGroup.RootProvider>
        </RatingGroup.PropsProvider>
      </>
    );
  }

  render(
    /** Mount an external machine beneath changing appearance defaults. */
    () => <Example />,
  );
  const root = document.querySelector('.lui-rating-group__root');
  if (!root) throw new Error('Rating Group root was not rendered.');
  const before = root.getAttribute('style');
  expect(root).toHaveClass('inherited-rating');
  expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true');
  expect(root).toHaveStyle({ color: 'rgb(1, 2, 3)' });
  fireEvent.click(screen.getByRole('button', { name: 'Change color' }));
  expect(document.querySelector('.lui-rating-group__root')).toBe(root);
  expect(root.getAttribute('style')).not.toBe(before);
  expect(root).toHaveStyle({ color: 'rgb(4, 5, 6)' });
  expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true');
}

it(
  'applies full reactive defaults to an external Rating Group root',
  verifiesExternalProviderDefaults,
);
