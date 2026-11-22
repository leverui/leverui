import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Progress, useProgress } from '../index';

afterEach(cleanup);

/** Verify the primitive owns progress semantics while Lever UI supplies slot hooks. */
function verifiesProgressParts(): void {
  render(
    /** Mount the public Progress namespace inside its component root. */
    () => (
      <>
        <Progress.Root value={30} min={10} max={50} size="sm" data-testid="root">
          <Progress.Label id="unit-progress-label" data-testid="label">
            Loading files
          </Progress.Label>
          <Progress.ValueText data-testid="value" />
          <Progress.Track aria-labelledby="unit-progress-label" data-testid="track">
            <Progress.Range data-testid="range" />
          </Progress.Track>
        </Progress.Root>
      </>
    ),
  );

  const root = screen.getByTestId('root');
  const track = screen.getByTestId('track');
  const range = screen.getByTestId('range');
  expect(root.hasAttribute('data-progress-root')).toBe(true);
  expect(root.className).toContain('leverui-progress__root');
  expect(root.hasAttribute('size')).toBe(false);
  expect(track.getAttribute('role')).toBe('progressbar');
  expect(screen.getByRole('progressbar', { name: 'Loading files' })).toBe(track);
  expect(track.getAttribute('aria-valuemin')).toBe('10');
  expect(track.getAttribute('aria-valuemax')).toBe('50');
  expect(track.getAttribute('aria-valuenow')).toBe('30');
  expect(range.getAttribute('style')).toContain('width: 50%');
  expect(screen.getByTestId('value').textContent).toBe('50%');
  expect(screen.getByTestId('label').tagName).toBe('SPAN');
  // Zag 2 exposes the value through the progress bar's aria-valuetext, not a live region.
  expect(screen.getByTestId('value').hasAttribute('aria-live')).toBe(false);
  expect(track.getAttribute('aria-valuetext')).toBe('50%');
}

it('renders accessible machine parts and the active slot recipe', verifiesProgressParts);

/** Check controlled value updates without replacing the range node. */
function verifiesControlledValue(): void {
  const [value, setValue] = createSignal<number | null>(25);

  /** Bind one mounted Progress root to the controlled value. */
  function Example(): JSX.Element {
    return (
      <>
        <Progress.Root value={value()}>
          <Progress.ValueText data-testid="value" />
          <Progress.Track data-testid="track">
            <Progress.Range data-testid="range" />
          </Progress.Track>
        </Progress.Root>
      </>
    );
  }

  render(
    /** Mount the controlled example once. */
    () => <Example />,
  );
  const range = screen.getByTestId('range');
  expect(range.getAttribute('style')).toContain('width: 25%');
  setValue(75);
  flush();
  expect(screen.getByTestId('range')).toBe(range);
  expect(range.getAttribute('style')).toContain('width: 75%');
  expect(screen.getByTestId('value').textContent).toBe('75%');
  setValue(null);
  flush();
  expect(screen.getByTestId('range')).toBe(range);
  expect(range.getAttribute('data-state')).toBe('indeterminate');
  expect(screen.getByTestId('track').hasAttribute('aria-valuenow')).toBe(false);
}

it('updates controlled and indeterminate values on the same range', verifiesControlledValue);

/** Verify the externally owned machine and context setter stay connected. */
async function verifiesExternalMachine(): Promise<void> {
  /** Create a machine once and render it through RootProvider. */
  function Example(): JSX.Element {
    const progress = useProgress({ defaultValue: 20 });
    return (
      <>
        <Progress.RootProvider value={progress} data-testid="root">
          <Progress.Track data-testid="track">
            <Progress.Range data-testid="range" />
          </Progress.Track>
          <Progress.Context>
            {
              /** Update the nearest machine through its public context. */
              (context) => (
                <button type="button" onClick={() => context().setValue(80)}>
                  Advance
                </button>
              )
            }
          </Progress.Context>
        </Progress.RootProvider>
      </>
    );
  }

  render(
    /** Mount the external machine inside a Solid owner. */
    () => <Example />,
  );
  expect(screen.getByTestId('track').getAttribute('aria-valuenow')).toBe('20');
  fireEvent.click(screen.getByRole('button', { name: 'Advance' }));
  await waitFor(
    /** Wait for Zag to process the machine event. */
    () => expect(screen.getByTestId('track').getAttribute('aria-valuenow')).toBe('80'),
  );
  expect(screen.getByTestId('range').getAttribute('style')).toContain('width: 80%');
}

it('supports an external machine and context actions', verifiesExternalMachine);

/** Reject a styled Progress part without a matching root context. */
function verifiesRootRequirement(): void {
  /** Mount an orphan part without a Progress root. */
  function mountOrphan(): void {
    render(
      /** Keep only the Progress root absent. */
      () => (
        <>
          <Progress.Track />
        </>
      ),
    );
  }

  expect(mountOrphan).toThrow(/ProgressRoot or ProgressRootProvider/);
}

it('requires a Progress root for styled parts', verifiesRootRequirement);
