import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { ProgressCircle, useProgress } from '../index';

afterEach(cleanup);

/** Verify the primitive's SVG progressbar and each Lever UI Circle slot. */
function verifiesCircleParts(): void {
  render(
    /** Mount the public Circle namespace inside its component root. */
    () => (
      <>
        <ProgressCircle.Root value={30} min={10} max={50} size="sm" data-testid="root">
          <ProgressCircle.Label id="unit-circle-label">Loading files</ProgressCircle.Label>
          <ProgressCircle.Circle aria-labelledby="unit-circle-label" data-testid="circle">
            <ProgressCircle.Track data-testid="track" />
            <ProgressCircle.Range data-testid="range" />
          </ProgressCircle.Circle>
          <ProgressCircle.ValueText data-testid="value" />
        </ProgressCircle.Root>
      </>
    ),
  );

  const root = screen.getByTestId('root');
  const circle = screen.getByRole('progressbar', { name: 'Loading files' });
  const track = screen.getByTestId('track');
  const range = screen.getByTestId('range');
  expect(root.hasAttribute('data-progress-root')).toBe(true);
  expect(root.className).toContain('lui-progress-circle__root');
  expect(root.hasAttribute('size')).toBe(false);
  expect(circle).toBe(screen.getByTestId('circle'));
  expect(circle.tagName.toLowerCase()).toBe('svg');
  expect(circle.getAttribute('aria-valuemin')).toBe('10');
  expect(circle.getAttribute('aria-valuemax')).toBe('50');
  expect(circle.getAttribute('aria-valuenow')).toBe('30');
  expect(track.tagName.toLowerCase()).toBe('circle');
  expect(range.tagName.toLowerCase()).toBe('circle');
  expect(range.getAttribute('style')).toContain('stroke-dasharray');
  expect(screen.getByTestId('value').textContent).toBe('50%');
}

it('renders accessible SVG machine parts and Circle slot classes', verifiesCircleParts);

/** Keep controlled values and indeterminate state on the same SVG nodes. */
function verifiesControlledCircle(): void {
  const [value, setValue] = createSignal<number | null>(25);

  /** Bind one mounted Circle root to the controlled value. */
  function Example(): JSX.Element {
    return (
      <>
        <ProgressCircle.Root value={value()}>
          <ProgressCircle.Circle data-testid="circle">
            <ProgressCircle.Track />
            <ProgressCircle.Range data-testid="range" />
          </ProgressCircle.Circle>
          <ProgressCircle.ValueText data-testid="value" />
        </ProgressCircle.Root>
      </>
    );
  }

  render(
    /** Mount the controlled example once. */
    () => <Example />,
  );
  const circle = screen.getByTestId('circle');
  const range = screen.getByTestId('range');
  expect(circle.getAttribute('aria-valuenow')).toBe('25');
  setValue(75);
  flush();
  expect(screen.getByTestId('circle')).toBe(circle);
  expect(screen.getByTestId('range')).toBe(range);
  expect(circle.getAttribute('aria-valuenow')).toBe('75');
  expect(screen.getByTestId('value').textContent).toBe('75%');
  setValue(null);
  flush();
  expect(circle.hasAttribute('aria-valuenow')).toBe(false);
  expect(range.getAttribute('data-state')).toBe('indeterminate');
}

it(
  'updates controlled and indeterminate states without replacing SVG nodes',
  verifiesControlledCircle,
);

/** Verify an external Progress machine can drive the Circle presentation. */
async function verifiesExternalMachine(): Promise<void> {
  /** Create one machine and render it through the Circle root provider. */
  function Example(): JSX.Element {
    const progress = useProgress({ defaultValue: 20 });
    return (
      <>
        <ProgressCircle.RootProvider value={progress}>
          <ProgressCircle.Circle data-testid="circle">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
          <ProgressCircle.Context>
            {
              /** Update the nearest machine through its public context. */
              (context) => {
                /** Advance the context-owned machine after a user click. */
                function advanceContext(): void {
                  context().setValue(80);
                }

                return (
                  <button type="button" onClick={advanceContext}>
                    Advance
                  </button>
                );
              }
            }
          </ProgressCircle.Context>
        </ProgressCircle.RootProvider>
      </>
    );
  }

  render(
    /** Mount the external machine inside a Solid owner. */
    () => <Example />,
  );
  expect(screen.getByTestId('circle').getAttribute('aria-valuenow')).toBe('20');
  fireEvent.click(screen.getByRole('button', { name: 'Advance' }));
  await waitFor(
    /** Wait for Zag to process the machine event. */
    () => expect(screen.getByTestId('circle').getAttribute('aria-valuenow')).toBe('80'),
  );
}

it('supports an external Progress machine and context actions', verifiesExternalMachine);

/** Preserve caller-owned SVG elements while attaching the primitive progress semantics. */
function verifiesSvgComposition(): void {
  render(
    /** Mount native SVG children through the public primitive composition prop. */
    () => (
      <>
        <ProgressCircle.Root value={40}>
          <ProgressCircle.Circle
            asChild={
              /** Merge machine props into the caller-owned SVG. */
              (getProps) => <svg {...getProps()} data-testid="owned-circle" />
            }
          >
            <ProgressCircle.Track
              asChild={
                /** Merge track geometry into the caller-owned SVG circle. */
                (getProps) => <circle {...getProps()} data-testid="owned-track" />
              }
            />
            <ProgressCircle.Range data-testid="owned-range" />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      </>
    ),
  );

  const circle = screen.getByTestId('owned-circle');
  expect(circle.tagName.toLowerCase()).toBe('svg');
  expect(circle.getAttribute('role')).toBe('progressbar');
  expect(circle.getAttribute('aria-valuenow')).toBe('40');
  expect(screen.getByTestId('owned-track').hasAttribute('data-progress-circle-track')).toBe(true);
  expect(screen.getByTestId('owned-range').hasAttribute('data-progress-circle-range')).toBe(true);
}

it('composes the primitive props into caller-owned SVG elements', verifiesSvgComposition);
