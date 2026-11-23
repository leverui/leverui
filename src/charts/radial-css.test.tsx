import { cleanup, render } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import { RadialBarChart } from './radial-bar-chart';
import { RadialChart } from './radial-chart';

afterEach(cleanup);

/** Verify finite radial choices and numeric geometry update on existing nodes. */
function verifiesRadialChartHooks(): void {
  const [size, setSize] = createSignal(200);
  const [placement, setPlacement] = createSignal<'inside' | 'point'>('inside');
  let rootRef: HTMLDivElement | undefined;
  const view = render(
    /** Keep size and placement under one reactive owner. */
    () => (
      <RadialChart
        data={[{ name: 'A', value: 10, color: 'teal.solid' }]}
        size={size()}
        innerRadius={50}
        label={placement()}
        legend
        centerTitle="Total"
        class="consumer-radial"
        style={{ 'outline-width': '2px' }}
        ref={(element) => (rootRef = element)}
      />
    ),
  );
  const root = view.container.querySelector('.leverui-radial-chart');
  if (!(root instanceof HTMLDivElement)) throw new Error('Radial chart root did not mount.');
  expect(rootRef).toBe(root);
  expect(root.classList.contains('consumer-radial')).toBe(true);
  expect(root.dataset.chartShape).toBe('donut');
  expect(root.dataset.labelPlacement).toBe('inside');
  expect(root.style.getPropertyValue('--lui-private-radial-chart-size')).toBe('200px');
  expect(root.style.outlineWidth).toBe('2px');
  expect(root.querySelector('.leverui-radial-chart__sector')).not.toBeNull();
  expect(root.querySelector('.leverui-radial-chart__legendSwatch')).not.toBeNull();
  expect(root.querySelector('.leverui-radial-chart__centerTitle')).not.toBeNull();
  setSize(240);
  flush();
  setPlacement('point');
  flush();
  expect(view.container.querySelector('.leverui-radial-chart')).toBe(root);
  expect(root.style.getPropertyValue('--lui-private-radial-chart-size')).toBe('240px');
  expect(root.querySelector('svg')?.getAttribute('width')).toBe('240');
  expect(root.querySelector('.leverui-radial-chart__labels')?.getAttribute('data-placement')).toBe(
    'point',
  );
}

/** Keep radial bar geometry dynamic and its fixed parts classed for authored CSS. */
function verifiesRadialBarHooks(): void {
  const [size, setSize] = createSignal(320);
  const view = render(
    /** Change size without replacing the SVG or color-coded rings. */
    () => (
      <RadialBarChart
        data={[{ name: 'January', value: 40, color: 'teal.solid' }]}
        size={size()}
        label
        legend
        class="consumer-radial-bar"
      />
    ),
  );
  const root = view.container.querySelector('.leverui-radial-bar-chart');
  if (!(root instanceof HTMLDivElement)) throw new Error('Radial bar root did not mount.');
  const svg = root.querySelector('svg');
  expect(root.classList.contains('consumer-radial-bar')).toBe(true);
  expect(root.querySelector('.leverui-radial-bar-chart__track')?.hasAttribute('fill')).toBe(false);
  expect(root.querySelector('.leverui-radial-bar-chart__label')).not.toBeNull();
  expect(root.querySelector('.leverui-radial-bar-chart__legendSwatch')).not.toBeNull();
  setSize(360);
  flush();
  expect(root.querySelector('svg')).toBe(svg);
  expect(root.style.getPropertyValue('--lui-private-radial-bar-size')).toBe('360px');
  expect(svg?.getAttribute('width')).toBe('360');
}

it('exposes reactive authored CSS hooks on radial charts', verifiesRadialChartHooks);
it('keeps radial bar geometry and static CSS parts separate', verifiesRadialBarHooks);
