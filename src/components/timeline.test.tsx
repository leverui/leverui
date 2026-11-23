import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Timeline, TimelineRoot, type TimelineRootBaseProps } from '../index';

/** Preserve every native part, list role, forwarded attribute, and root ref. */
function verifiesNativeParts(): void {
  let root: HTMLDivElement | undefined;

  /** Capture the actual Timeline root element. */
  function captureRoot(element: HTMLDivElement): void {
    root = element;
  }

  render(
    /** Mount one complete event through the public namespace. */
    () => (
      <>
        <Timeline.Root ref={captureRoot} title="Order history" data-testid="timeline">
          <Timeline.Item data-testid="item">
            <Timeline.Connector data-testid="connector">
              <Timeline.Separator data-testid="separator" />
              <Timeline.Indicator data-testid="indicator">1</Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content data-testid="content">
              <Timeline.Title data-testid="title">Order placed</Timeline.Title>
              <Timeline.Description data-testid="description">Yesterday</Timeline.Description>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      </>
    ),
  );

  const timeline = screen.getByTestId('timeline');
  expect(timeline).toBe(root);
  expect(timeline.tagName).toBe('DIV');
  expect(timeline.getAttribute('role')).toBe('list');
  expect(timeline.getAttribute('title')).toBe('Order history');
  expect(screen.getByTestId('item').getAttribute('role')).toBe('listitem');
  for (const part of ['connector', 'separator', 'indicator', 'content', 'title', 'description']) {
    expect(screen.getByTestId(part).tagName).toBe('DIV');
  }
  expect(screen.getByTestId('title').textContent).toBe('Order placed');
  expect(timeline.hasAttribute('size')).toBe(false);
  expect(timeline.hasAttribute('variant')).toBe(false);
  expect(timeline.hasAttribute('showLastSeparator')).toBe(false);
}

it('renders native Timeline parts with list semantics', verifiesNativeParts);

/** Honor explicit native role overrides without changing CSS choices. */
function verifiesRoleOverrides(): void {
  render(
    /** Mount a Timeline whose roles are supplied by the consumer. */
    () => (
      <>
        <TimelineRoot role="group" data-testid="custom-root">
          <Timeline.Item role="presentation" data-testid="custom-item" />
        </TimelineRoot>
      </>
    ),
  );
  expect(screen.getByTestId('custom-root').getAttribute('role')).toBe('group');
  expect(screen.getByTestId('custom-item').getAttribute('role')).toBe('presentation');
}

it('preserves explicit Timeline role overrides', verifiesRoleOverrides);

/** Update inherited variants without replacing native event nodes. */
function verifiesReactiveDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Mount inherited and explicitly sized roots under one provider. */
  function Example(): JSX.Element {
    /** Read changing choices for descendant roots. */
    function readDefaults(): TimelineRootBaseProps {
      return { size: large() ? 'xl' : 'sm', variant: 'outline' };
    }

    return (
      <>
        <Timeline.RootPropsProvider value={readDefaults}>
          <Timeline.Root data-testid="inherited">
            <Timeline.Item>
              <Timeline.Indicator data-testid="inherited-indicator" />
              <span class="lui-timeline__title" data-testid="style-probe">
                Custom title
              </span>
            </Timeline.Item>
          </Timeline.Root>
          <Timeline.Root size="md" data-testid="fixed">
            <Timeline.Item />
          </Timeline.Root>
        </Timeline.RootPropsProvider>
      </>
    );
  }

  render(
    /** Construct both roots before changing the provider signal. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const indicator = screen.getByTestId('inherited-indicator');
  const fixed = screen.getByTestId('fixed');
  const previousRootClass = inherited.className;
  const previousIndicatorClass = indicator.className;
  const fixedClass = fixed.className;
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(screen.getByTestId('inherited-indicator')).toBe(indicator);
  expect(inherited.getAttribute('data-size')).toBe('xl');
  expect(inherited.getAttribute('data-variant')).toBe('outline');
  expect(inherited.className).toBe(previousRootClass);
  expect(indicator.className).toBe(previousIndicatorClass);
  expect(screen.getByTestId('style-probe').className).toBe('lui-timeline__title');
  expect(fixed.className).toBe(fixedClass);
}

it(
  'updates Timeline provider variants while honoring explicit root props',
  verifiesReactiveDefaults,
);

/** Reject a styled part without a Timeline root context. */
function verifiesRootRequirement(): void {
  /** Attempt to mount an indicator without its root. */
  function mountOrphan(): void {
    render(
      /** Keep the package provider but omit the Timeline root. */
      () => (
        <>
          <Timeline.Indicator>Orphan</Timeline.Indicator>
        </>
      ),
    );
  }

  expect(mountOrphan).toThrow(/inside TimelineRoot/);
}

it('requires a Timeline root for styled parts', verifiesRootRequirement);

/** Keep unstyled parts and native consumer styles on their intended paths. */
function verifiesTimelinePresentationPaths(): void {
  render(
    /** Mount unstyled and consumer-styled roots under the default provider. */
    () => (
      <>
        <Timeline.Root unstyled data-testid="unstyled-timeline">
          <Timeline.Item>
            <Timeline.Indicator unstyled data-testid="unstyled-timeline-indicator">
              1
            </Timeline.Indicator>
          </Timeline.Item>
        </Timeline.Root>
        <Timeline.Root class="custom-timeline" style={{ gap: '8px' }} data-testid="custom-timeline">
          <Timeline.Item />
        </Timeline.Root>
      </>
    ),
  );
  expect(screen.getByTestId('unstyled-timeline').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('unstyled-timeline-indicator').hasAttribute('data-unstyled')).toBe(
    true,
  );
  expect(screen.getByTestId('custom-timeline').getAttribute('style')).toContain('gap: 8px');
  expect(screen.getByTestId('custom-timeline').className).toContain('custom-timeline');
}

it('retains unstyled and native consumer presentation', verifiesTimelinePresentationPaths);
