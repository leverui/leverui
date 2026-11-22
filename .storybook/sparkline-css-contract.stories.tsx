import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Sparkline } from '../src';

const values = [{ value: 10 }, { value: 18 }, { value: 13 }] as const;

/** Expose native props, reactive geometry, and the unstyled path. */
function SparklineCssContract(): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Toggle chart geometry without replacing the SVG node. */
  function toggleWidth(): void {
    setWide(!wide());
  }

  /** Mark the SVG received by the consumer's native ref. */
  function markChart(element: SVGSVGElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  return (
    <>
      <button type="button" data-testid="sparkline-size-toggle" onClick={toggleWidth}>
        Toggle width
      </button>
      <div data-testid="sparkline-reactive">
        <Sparkline
          data={values}
          width={wide() ? 160 : 112}
          color="green.solid"
          class="consumer-chart"
          style={{ '--leverui-sparkline-line-width': '3' }}
          ref={markChart}
          aria-label="Reactive Sparkline"
        />
      </div>
      <div data-testid="sparkline-unstyled">
        <Sparkline data={values} unstyled aria-label="Unstyled Sparkline" />
      </div>
    </>
  );
}

const meta = {
  title: 'Internal/Sparkline CSS Contract',
  component: SparklineCssContract,
} satisfies Meta<typeof SparklineCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: SparklineCssContract };
