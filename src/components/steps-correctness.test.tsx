import { Steps as PrimitiveSteps } from '../primitives/components/steps';
import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { StepsNumber, StepsStatus } from './steps-indicator-content';
import { useSteps } from './steps-machine';
import { StepsPropsProvider } from './steps-props';
import { StepsRootProvider } from './steps-root';

afterEach(cleanup);

/** Keep an inherited orientation from changing an external machine. */
function verifiesProviderOrientation(): void {
  /** Build an independent horizontal machine for each root. */
  function HorizontalRoot(props: { testId: string }): JSX.Element {
    const machine = useSteps({ items: [{ value: 'only' }], orientation: 'horizontal' });
    return <StepsRootProvider value={machine} data-testid={props.testId} />;
  }

  render(
    /** Compare equal machines with and without a conflicting inherited default. */
    () => (
      <>
        <StepsPropsProvider value={{ orientation: 'vertical' }}>
          <HorizontalRoot testId="inherited-root" />
        </StepsPropsProvider>
        <HorizontalRoot testId="plain-root" />
      </>
    ),
  );
  const inherited = screen.getByTestId('inherited-root');
  const plain = screen.getByTestId('plain-root');
  expect(inherited.getAttribute('data-orientation')).toBe('horizontal');
  expect(inherited.hasAttribute('orientation')).toBe(false);
  expect(inherited.className).toBe(plain.className);
}

it('aligns provider styling with an external machine', verifiesProviderOrientation);

/** Follow live orientation changes in an externally owned primitive accessor. */
function verifiesReactiveProviderOrientation(): void {
  const [orientation, setOrientation] = createSignal<'horizontal' | 'vertical'>('horizontal');

  /** Create the machine from a tracked Solid props accessor. */
  function Example(): JSX.Element {
    const machine = useSteps(
      /** Keep the machine's ARIA direction reactive. */
      () => ({ items: [{ value: 'only' }], orientation: orientation() }),
    );
    return <StepsRootProvider value={machine} data-testid="reactive-provider-root" />;
  }

  render(
    /** Mount one provider root before changing the external accessor. */
    () => <Example />,
  );
  const root = screen.getByTestId('reactive-provider-root');
  const horizontalClass = root.className;
  expect(root.getAttribute('data-orientation')).toBe('horizontal');
  setOrientation('vertical');
  flush();
  expect(root.getAttribute('data-orientation')).toBe('vertical');
  expect(root.className).toBe(horizontalClass);
}

it('updates provider orientation on one native root', verifiesReactiveProviderOrientation);

/** Render Number with only a primitive item context. */
function verifiesStandaloneNumber(): void {
  render(
    /** Keep the number independent of a Lever UI Steps root. */
    () => (
      <PrimitiveSteps.Root items={[{ value: 'only' }]}>
        <PrimitiveSteps.Item value="only">
          <StepsNumber as="span" data-testid="standalone-number" />
        </PrimitiveSteps.Item>
      </PrimitiveSteps.Root>
    ),
  );
  const number = screen.getByTestId('standalone-number');
  expect(number.tagName).toBe('SPAN');
  expect(number.textContent).toBe('1');
}

it('renders Number under a plain primitive item context', verifiesStandaloneNumber);

/** Preserve the child renderer and one-based content. */
function verifiesNumberChildRenderer(): void {
  render(
    /** Keep Number independent of the Lever UI Steps root. */
    () => (
      <PrimitiveSteps.Root items={[{ value: 'only' }]}>
        <PrimitiveSteps.Item value="only">
          <StepsNumber
            class="number-parent"
            data-testid="number-child"
            asChild={
              /** Merge number attributes through the primitive's child contract. */
              (getProps) => <span {...getProps()} />
            }
          />
        </PrimitiveSteps.Item>
      </PrimitiveSteps.Root>
    ),
  );
  const number = screen.getByTestId('number-child');
  expect(number.tagName).toBe('SPAN');
  expect(number.className).toContain('number-parent');
  expect(number.textContent).toBe('1');
}

it('renders Number through a typed child renderer', verifiesNumberChildRenderer);

/** Exercise complete, current, and incomplete fallback content. */
function verifiesStatusSelection(): void {
  render(
    /** Supply three item states from one primitive machine. */
    () => (
      // Zag 2 tracks completion explicitly, so the first step is listed as completed.
      <PrimitiveSteps.Root
        items={[{ value: 'first' }, { value: 'second' }, { value: 'third' }]}
        defaultValue="second"
        defaultCompletedValues={['first']}
      >
        <PrimitiveSteps.Item value="first">
          <StepsStatus complete="Complete" incomplete="Incomplete" current="Current" />
        </PrimitiveSteps.Item>
        <PrimitiveSteps.Item value="second">
          <StepsStatus complete="Complete" incomplete="Incomplete" current="Current" />
        </PrimitiveSteps.Item>
        <PrimitiveSteps.Item value="third">
          <StepsStatus complete="Complete" incomplete={null} current="Future fallback" />
        </PrimitiveSteps.Item>
      </PrimitiveSteps.Root>
    ),
  );
  expect(screen.getByText('Complete')).toBeTruthy();
  expect(screen.getByText('Current')).toBeTruthy();
  expect(screen.getByText('Future fallback')).toBeTruthy();
}

it('selects each status and the incomplete fallback', verifiesStatusSelection);
