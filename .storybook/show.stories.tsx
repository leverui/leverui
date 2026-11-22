import { createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Show } from '../src';

/** Exercise basic visibility, fallback, and reactive render functions. */
function ShowContractExample(): JSX.Element {
  const [count, setCount] = createSignal(0);
  const [value, setValue] = createSignal<number | undefined>();

  /** Advance the boolean condition used by the direct-child examples. */
  function incrementCount(): void {
    setCount(count() + 1);
  }

  /** Show the render-function fallback for a falsy numeric value. */
  function setZero(): void {
    setValue(0);
  }

  /** Mount the render-function branch with a truthy value. */
  function setTen(): void {
    setValue(10);
  }

  /** Update the narrowed value without leaving the truthy branch. */
  function incrementValue(): void {
    setValue((value() ?? 0) + 1);
  }

  /** Return the render-function branch to its fallback. */
  function clearValue(): void {
    setValue(undefined);
  }

  /** Read the narrowed value in Solid's tracked JSX expression. */
  function renderValue(current: Accessor<number>): JSX.Element {
    return <output data-testid="show-value">Value: {current()}</output>;
  }

  return (
    <div data-testid="show-story">
      <button type="button" data-testid="show-count-toggle" onClick={incrementCount}>
        Count: {count()}
      </button>
      <Show when={count() > 3}>
        <div data-testid="show-basic">My Content</div>
      </Show>
      <Show when={count() > 3} fallback={<p data-testid="show-count-fallback">Not there yet</p>}>
        <div data-testid="show-count-content">Congrats</div>
      </Show>
      <button type="button" data-testid="show-set-zero" onClick={setZero}>
        Zero
      </button>
      <button type="button" data-testid="show-set-ten" onClick={setTen}>
        Ten
      </button>
      <button type="button" data-testid="show-increment-value" onClick={incrementValue}>
        Increment value
      </button>
      <button type="button" data-testid="show-clear-value" onClick={clearValue}>
        Clear value
      </button>
      <Show when={value()} fallback={<span data-testid="show-value-fallback">No value</span>}>
        {renderValue}
      </Show>
    </div>
  );
}

const meta = {
  title: 'Utilities/Show',
  component: ShowContractExample,
} satisfies Meta<typeof ShowContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
