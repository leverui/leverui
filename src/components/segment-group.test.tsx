import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it, vi } from 'vitest';
import {
  SegmentGroup,
  SegmentGroupRoot,
  useSegmentGroup,
  type SegmentGroupValueChangeDetails,
} from '../index';

afterEach(cleanup);

/** Render the public convenience item API inside the owned machine. */
function GeneratedExample(): JSX.Element {
  return (
    <>
      <form data-testid="segment-form">
        <SegmentGroup.Root name="framework" defaultValue="React" data-testid="segment-root">
          <SegmentGroup.Items
            items={['React', 'Solid', { value: 'Vue', label: 'Vue', disabled: true }]}
          />
        </SegmentGroup.Root>
      </form>
    </>
  );
}

/** Preserve native selection, form data, disabled state, and root orientation. */
async function verifiesGeneratedItems(): Promise<void> {
  render(
    /** Mount the public convenience composition. */
    () => <GeneratedExample />,
  );
  const root = screen.getByTestId('segment-root');
  const react = screen.getByRole('radio', { name: 'React' }) as HTMLInputElement;
  const solid = screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement;
  const vue = screen.getByRole('radio', { name: 'Vue' }) as HTMLInputElement;
  expect(root).toHaveAttribute('data-orientation', 'horizontal');
  expect(root).toHaveClass('leverui-segment-group__root');
  expect(react.checked).toBe(true);
  expect(vue.disabled).toBe(true);
  fireEvent.click(screen.getByText('Solid'));
  await waitFor(
    /** Wait for Zag to update the checked native input. */
    () => expect(solid.checked).toBe(true),
  );
  expect(new FormData(screen.getByTestId('segment-form') as HTMLFormElement).get('framework')).toBe(
    'Solid',
  );
  fireEvent.click(screen.getByText('Vue'));
  expect(solid.checked).toBe(true);
}

it('renders generated options with native selection and form values', verifiesGeneratedItems);

/** Verify controlled state and the callback contract without replacing parts. */
async function verifiesControlledSelection(): Promise<void> {
  const changed = vi.fn();

  /** Own the selected value outside Segment Group. */
  function Example(): JSX.Element {
    const [value, setValue] = createSignal<string | null>('React');

    /** Update the controlled value after a primitive selection event. */
    function handleValueChange(details: SegmentGroupValueChangeDetails): void {
      changed(details);
      setValue(details.value);
      flush();
    }

    /** Change selection from outside the group. */
    function selectSolid(): void {
      setValue('Solid');
      flush();
    }

    return (
      <>
        <button type="button" onClick={selectSolid}>
          Select Solid
        </button>
        <SegmentGroup.Root value={value()} onValueChange={handleValueChange} orientation="vertical">
          <SegmentGroup.Item value="React">
            <SegmentGroup.ItemText>React</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item value="Solid">
            <SegmentGroup.ItemText>Solid</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </>
    );
  }

  render(
    /** Mount the controlled composition. */
    () => <Example />,
  );
  const solid = screen.getByRole('radio', { name: 'Solid' }) as HTMLInputElement;
  expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'vertical');
  fireEvent.click(screen.getByRole('button', { name: 'Select Solid' }));
  await waitFor(
    /** Observe external selection on the native input. */
    () => expect(solid.checked).toBe(true),
  );
  fireEvent.click(screen.getByRole('radio', { name: 'React' }));
  await waitFor(
    /** Observe the machine's selection callback after native input. */
    () => expect(changed).toHaveBeenCalledWith({ value: 'React' }),
  );
}

it('preserves controlled value changes and explicit orientation', verifiesControlledSelection);

/** Style a caller-owned machine and inherited defaults. */
function verifiesRootProvider(): void {
  /** Construct machine state before the styled root. */
  function Example(): JSX.Element {
    const machine = useSegmentGroup({ defaultValue: 'React', name: 'framework' });
    return (
      <>
        <SegmentGroup.PropsProvider value={{ size: 'lg', class: 'consumer-root' }}>
          <SegmentGroup.RootProvider value={machine}>
            <SegmentGroup.Items items={['React', 'Solid']} />
          </SegmentGroup.RootProvider>
        </SegmentGroup.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the external machine composition. */
    () => <Example />,
  );
  expect(screen.getByRole('radiogroup')).toHaveClass('consumer-root');
  expect((screen.getByRole('radio', { name: 'React' }) as HTMLInputElement).checked).toBe(true);
  expect(SegmentGroupRoot).toBe(SegmentGroup.Root);
}

it('styles a caller-owned machine through root and props providers', verifiesRootProvider);
