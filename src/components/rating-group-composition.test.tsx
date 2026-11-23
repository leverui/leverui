import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import {
  RatingGroup,
  useRatingGroup,
  type RatingGroupIconProps,
  type RatingGroupValueChangeDetails,
} from '../index';

afterEach(cleanup);

/** Render a fresh custom icon for each visual layer. */
function CircleIcon(props: RatingGroupIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

/** Keep a caller-owned value synchronized with machine changes. */
async function verifiesControlledValue(): Promise<void> {
  /** Own selection outside the rating machine. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal(1);

    /** Accept the selected rating from the primitive. */
    function handleChange(details: RatingGroupValueChangeDetails): void {
      setValue(details.value);
      flush();
    }

    /** Set a rating from outside the machine. */
    function selectFive(): void {
      setValue(5);
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectFive}>
          Set five
        </button>
        <RatingGroup.Root value={value()} onValueChange={handleChange}>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
        <output data-testid="selected-value">{value()}</output>
      </>
    );
  }

  render(
    /** Mount one controlled consumer. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
  await waitFor(
    /** Confirm the primitive updates the caller's signal. */
    () => expect(screen.getByTestId('selected-value').textContent).toBe('3'),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Set five' }));
  expect(screen.getByRole('radio', { name: '5 stars' })).toHaveAttribute('aria-checked', 'true');
}

it('keeps controlled selection synchronized', verifiesControlledValue);

/** Support caller-owned machines, custom icons, and the primitive child rendering. */
async function verifiesCustomComposition(): Promise<void> {
  const indicatorRefs: Element[] = [];
  const childRefs: Element[] = [];
  /** Build the machine outside the styled root. */
  function Example(): JSX.Element {
    const rating = useRatingGroup({ name: 'score', defaultValue: 1, count: 2 });
    return (
      <>
        <RatingGroup.RootProvider value={rating}>
          <RatingGroup.Label>Quality</RatingGroup.Label>
          <RatingGroup.Control
            asChild={
              /** Put the primitive attributes on the caller's control element. */
              (getProps) => <div {...getProps()} data-testid="custom-control" />
            }
          >
            <RatingGroup.Item index={1}>
              <RatingGroup.ItemIndicator as="strong" icon={CircleIcon} data-testid="first-icon" />
            </RatingGroup.Item>
            <RatingGroup.Item index={2}>
              <RatingGroup.ItemIndicator
                icon={CircleIcon}
                ref={
                  /** Record the component owner's native indicator element. */
                  (element: Element) => indicatorRefs.push(element)
                }
                asChild={
                  /** Keep the layered icons in a caller-owned native indicator. */
                  (getProps) => (
                    <span
                      {...getProps({
                        /** Record the child owner's shared native element. */
                        ref: (element) => childRefs.push(element),
                      })}
                      data-testid="second-icon"
                    />
                  )
                }
              />
            </RatingGroup.Item>
          </RatingGroup.Control>
          <RatingGroup.HiddenInput />
        </RatingGroup.RootProvider>
      </>
    );
  }

  render(
    /** Mount custom children under the external machine. */
    () => <Example />,
  );
  const control = screen.getByTestId('custom-control');
  const icon = screen.getByTestId('first-icon');
  expect(control).toHaveAttribute('role', 'radiogroup');
  expect(control.querySelectorAll('[role="radio"]')).toHaveLength(2);
  expect(icon.tagName).toBe('STRONG');
  expect(icon.querySelectorAll('svg')).toHaveLength(2);
  expect(icon.querySelector('[data-bg]')).not.toBeNull();
  expect(icon.querySelector('[data-fg]')).not.toBeNull();
  expect(screen.getByTestId('second-icon')).toHaveClass('lui-rating-group__itemIndicator');
  expect(screen.getByTestId('second-icon').querySelectorAll('svg')).toHaveLength(2);
  expect(indicatorRefs).toContain(screen.getByTestId('second-icon'));
  expect(childRefs).toContain(screen.getByTestId('second-icon'));
  fireEvent.click(screen.getByRole('radio', { name: '2 stars' }));
  await waitFor(
    /** Confirm custom parts retain the machine's selection behavior. */
    () =>
      expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute(
        'aria-checked',
        'true',
      ),
  );
}

it('composes an external machine with a custom icon and child control', verifiesCustomComposition);

/** Update inherited appearance without replacing a descendant machine. */
function verifiesProviderAppearance(): void {
  /** Switch the inherited size while preserving the same rating root. */
  function Example(): JSX.Element {
    const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

    /** Change only the inherited authored CSS size. */
    function resize(): void {
      setSize('lg');
      flush();
    }

    return (
      <>
        <button type="button" onClick={resize}>
          Resize
        </button>
        <RatingGroup.PropsProvider
          value={
            /** Follow the size signal while keeping the initial rating fixed. */
            () => ({ defaultValue: 2, size: size() })
          }
        >
          <RatingGroup.Root>
            <RatingGroup.Control />
          </RatingGroup.Root>
        </RatingGroup.PropsProvider>
      </>
    );
  }

  render(
    /** Mount one root beneath reactive defaults. */
    () => <Example />,
  );
  const root = document.querySelector('.lui-rating-group__root');
  const item = screen.getByRole('radio', { name: '2 stars' });
  expect(root).toHaveAttribute('data-size', 'sm');
  const stableClass = item.getAttribute('class');
  fireEvent.click(screen.getByRole('button', { name: 'Resize' }));
  expect(document.querySelector('.lui-rating-group__root')).toBe(root);
  expect(item).toHaveAttribute('aria-checked', 'true');
  expect(root).toHaveAttribute('data-size', 'lg');
  expect(item.getAttribute('class')).toBe(stableClass);
}

it('follows reactive provider appearance without remounting', verifiesProviderAppearance);
