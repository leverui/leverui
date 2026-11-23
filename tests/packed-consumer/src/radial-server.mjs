import assert from 'node:assert/strict';
import { RadialBarChart, RadialChart } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed radial chart families with packaged CSS. */
function renderRadialCharts() {
  const radial = renderToString(
    /** Keep one sector and public labels in server markup. */
    () =>
      createComponent(RadialChart, {
        data: [{ name: 'A', value: 10, color: 'teal.solid' }],
        label: 'point',
        legend: true,
        class: 'consumer-share',
      }),
  );
  const bars = renderToString(
    /** Keep one ring and its curved value label in server markup. */
    () =>
      createComponent(RadialBarChart, {
        data: [{ name: 'B', value: 20, color: 'teal.solid' }],
        label: true,
        legend: true,
        class: 'consumer-rings',
      }),
  );
  return { radial, bars };
}

const { radial, bars } = renderRadialCharts();
assert.match(radial, /lui-radial-chart__sector/);
assert.match(radial, /consumer-share/);
assert.match(radial, /lui-radial-chart__labelLine/);
assert.match(bars, /lui-radial-bar-chart__track/);
assert.match(bars, /consumer-rings/);
assert.match(bars, /lui-radial-bar-chart__label/);
console.log('Packed Radial Chart and Radial Bar Chart server rendering passed.');
