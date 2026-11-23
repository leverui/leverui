import { cleanup, fireEvent, render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import { BarChart } from './bar-chart';

afterEach(cleanup);

/** Verify native props and stable chart hooks through reactive appearance changes. */
function verifiesBarChartHooks(): void {
  const [horizontal, setHorizontal] = createSignal(false);
  const [unstyled, setUnstyled] = createSignal(false);
  const view = render(
    /** Keep native style and orientation on one chart owner. */
    () => (
      <BarChart
        id="bar-native-root"
        title="Bar chart details"
        data-consumer="kept"
        aria-describedby="bar-description"
        data={[{ month: 'January', value: 20 }]}
        xKey="month"
        series={[{ name: 'value', color: 'teal.solid', label: true }]}
        orientation={horizontal() ? 'horizontal' : 'vertical'}
        legendPlacement={horizontal() ? 'top-right' : 'bottom'}
        showLegend
        tooltip
        referenceArea={{ from: 5, to: 10, label: 'Target', color: 'green.solid' }}
        referenceValue={{ value: 12, color: 'blue.solid' }}
        class="consumer-bars"
        style={{ width: horizontal() ? '430px' : '340px' }}
        unstyled={unstyled()}
        ref={
          /** Confirm the consumer ref receives the same native container. */
          (element) => {
            element.dataset.refTag = element.tagName.toLowerCase();
          }
        }
        onFocus={
          /** Observe native focus after Bar Chart opens the first category. */
          (event) => {
            event.currentTarget.dataset.consumerFocus = 'true';
          }
        }
        onKeyDown={
          /** Observe native keyboard events alongside chart navigation. */
          (event) => {
            event.currentTarget.dataset.consumerKey = event.key;
          }
        }
        onBlur={
          /** Observe native blur after the chart dismisses its tooltip. */
          (event) => {
            event.currentTarget.dataset.consumerBlur = 'true';
          }
        }
      />
    ),
  );
  const root = view.container.querySelector('.leverui-bar-chart');
  if (!(root instanceof HTMLDivElement)) throw new Error('The Bar Chart root did not mount.');
  expect(root).toHaveClass('consumer-bars');
  expect(root).toHaveAttribute('id', 'bar-native-root');
  expect(root).toHaveAttribute('title', 'Bar chart details');
  expect(root).toHaveAttribute('data-consumer', 'kept');
  expect(root).toHaveAttribute('aria-describedby', 'bar-description');
  expect(root).not.toHaveAttribute('xKey');
  expect(root).not.toHaveAttribute('maxHeight');
  expect(root).toHaveAttribute('data-ref-tag', 'div');
  expect(root).toHaveAttribute('data-interactive', '');
  expect(root).toHaveAttribute('data-orientation', 'vertical');
  expect(root).toHaveStyle({ width: '340px' });
  expect(root.querySelector('.leverui-bar-chart__svg')).not.toBeNull();
  expect(root.querySelector('.leverui-bar-chart__axes')).not.toBeNull();
  expect(root.querySelector('.leverui-bar-chart__bar-label')).not.toBeNull();
  expect(root.querySelector('.leverui-bar-chart__reference-area')).not.toBeNull();
  expect(root.querySelector('.leverui-bar-chart__reference-line')).not.toBeNull();
  expect(root.querySelector('.leverui-bar-chart__reference-area')).toHaveAttribute(
    'style',
    'fill: var(--lui-colors-green-solid);',
  );
  expect(root.querySelector('.leverui-bar-chart__reference-line')).toHaveAttribute(
    'style',
    'stroke: var(--lui-colors-blue-solid);',
  );
  expect(root.querySelector('.leverui-bar-chart__legend')).not.toBeNull();

  fireEvent.focus(root);
  expect(root.querySelector('.leverui-bar-chart__tooltip')).not.toBeNull();
  expect(root).toHaveAttribute('data-consumer-focus', 'true');
  fireEvent.keyDown(root, { key: 'ArrowRight' });
  expect(root).toHaveAttribute('data-consumer-key', 'ArrowRight');
  fireEvent.blur(root);
  expect(root).toHaveAttribute('data-consumer-blur', 'true');
  setHorizontal(true);
  flush();
  setUnstyled(true);
  flush();
  expect(view.container.querySelector('.leverui-bar-chart')).toBe(root);
  expect(root).toHaveAttribute('data-orientation', 'horizontal');
  expect(root).toHaveAttribute('data-legend-placement', 'top-right');
  expect(root).toHaveAttribute('data-unstyled', '');
  expect(root).toHaveStyle({ width: '430px' });
}

it('keeps native Bar Chart hooks and refs reactive', verifiesBarChartHooks);

/** Preserve native keyboard behavior when no chart tooltip is interactive. */
function verifiesPassiveNativeHandlers(): void {
  const view = render(
    /** Render a labeled passive chart with caller-owned focus and key policy. */
    () => (
      <BarChart
        data={[{ month: 'January', value: 20 }]}
        xKey="month"
        series={[{ name: 'value', color: 'teal.solid' }]}
        id="passive-bars"
        role="region"
        tabindex="0"
        aria-label="Passive bars"
        onKeyDown={
          /** Record whether the chart intercepted a native Arrow key. */
          (event) => {
            event.currentTarget.dataset.arrowPrevented = String(event.defaultPrevented);
          }
        }
      />
    ),
  );
  const root = view.container.querySelector('#passive-bars');
  if (!(root instanceof HTMLDivElement)) throw new Error('The passive Bar Chart did not mount.');
  expect(root).toHaveAttribute('role', 'region');
  expect(root).toHaveAttribute('tabindex', '0');
  expect(root).toHaveAttribute('aria-label', 'Passive bars');
  expect(root).not.toHaveAttribute('data-interactive');
  expect(fireEvent.keyDown(root, { key: 'ArrowRight' })).toBe(true);
  expect(root).toHaveAttribute('data-arrow-prevented', 'false');
  expect(root.querySelector('.leverui-bar-chart__tooltip')).toBeNull();
}

it(
  'forwards native keyboard events without interception when passive',
  verifiesPassiveNativeHandlers,
);
