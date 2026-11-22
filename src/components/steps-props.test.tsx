import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { StepsIndicator, StepsItem, StepsList } from './steps-parts';
import { StepsPropsProvider } from './steps-props';
import { StepsRoot } from './steps-root';

afterEach(cleanup);

/** Verify reactive defaults and local precedence around one machine root. */
function verifiesReactiveDefaults(): void {
  const items = [{ value: 'first' }, { value: 'second' }];
  // Zag 2 tracks completion explicitly, so the first step is listed as completed.
  const [defaults, setDefaults] = createSignal({
    items,
    defaultValue: 'second',
    defaultCompletedValues: ['first'],
    title: 'Inherited title',
  });

  /** Mount a machine that receives state and native defaults. */
  function Example(): JSX.Element {
    return (
      <StepsPropsProvider value={defaults}>
        <StepsRoot data-testid="steps-root">
          <StepsList>
            <StepsItem value="first">
              <StepsIndicator data-testid="first-indicator" />
            </StepsItem>
            <StepsItem value="second">
              <StepsIndicator data-testid="second-indicator" />
            </StepsItem>
          </StepsList>
        </StepsRoot>
      </StepsPropsProvider>
    );
  }

  render(
    /** Exercise the public context in Solid's client renderer. */
    () => <Example />,
  );
  expect(screen.getByTestId('steps-root').title).toBe('Inherited title');
  expect(screen.getByTestId('second-indicator').getAttribute('data-current')).toBe('');
  expect(screen.getByTestId('first-indicator').getAttribute('data-incomplete')).toBeNull();
  setDefaults({
    items,
    defaultValue: 'second',
    defaultCompletedValues: ['first'],
    title: 'Updated title',
  });
  flush();
  expect(screen.getByTestId('steps-root').title).toBe('Updated title');
}

it('inherits a step default and updates native defaults reactively', verifiesReactiveDefaults);
