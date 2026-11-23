import { cleanup, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { Progress, ProgressCircle } from '../index';

afterEach(cleanup);

/** Preserve native root composition and refs for both Progress recipes. */
function verifiesRootComposition(): void {
  let linearRoot: Element | undefined;
  let circleRoot: Element | undefined;

  /** Record the caller-owned linear root. */
  function recordLinearRoot(element: Element): void {
    linearRoot = element;
  }

  /** Record the caller-owned Circle root. */
  function recordCircleRoot(element: Element): void {
    circleRoot = element;
  }

  render(
    /** Mount both families under the same style system. */
    () => (
      <>
        <Progress.Root
          value={30}
          ref={recordLinearRoot}
          asChild={
            /** Merge the machine root into the selected section. */
            (getProps) => <section {...getProps()} data-testid="linear-owned-root" />
          }
        >
          <Progress.Track data-testid="linear-owned-track">
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <ProgressCircle.Root
          value={60}
          ref={recordCircleRoot}
          asChild={
            /** Merge the Circle machine root into the selected section. */
            (getProps) => <section {...getProps()} data-testid="circle-owned-root" />
          }
        >
          <ProgressCircle.Circle data-testid="circle-owned-svg">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
      </>
    ),
  );

  const linear = screen.getByTestId('linear-owned-root');
  const circle = screen.getByTestId('circle-owned-root');
  expect(linear.tagName).toBe('SECTION');
  expect(circle.tagName).toBe('SECTION');
  expect(linearRoot).toBe(linear);
  expect(circleRoot).toBe(circle);
  expect(linear.className).toContain('lui-progress__root');
  expect(circle.className).toContain('lui-progress-circle__root');
  expect(screen.getByTestId('linear-owned-track').getAttribute('aria-valuenow')).toBe('30');
  expect(screen.getByTestId('circle-owned-svg').getAttribute('aria-valuenow')).toBe('60');
}

it('composes both Progress root families into caller-owned elements', verifiesRootComposition);
