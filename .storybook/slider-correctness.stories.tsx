import { For, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Slider } from '../src';

const collisionModes = ['none', 'push', 'swap'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['outline', 'solid'] as const;
const orientations = ['horizontal', 'vertical'] as const;
const matrixCases = sizes.flatMap(
  /** Pair every size with both visual variants. */
  (size) =>
    variants.flatMap(
      /** Exercise both orientations for each visual variant. */
      (variant) =>
        orientations.map(
          /** Identify one combination for the browser CSS matrix. */
          (orientation) => ({ size, variant, orientation }),
        ),
    ),
);

/** Render pointer collision modes with identical starting values. */
function SliderCollisionExample(): JSX.Element {
  /** Give each collision mode a separately addressable slider. */
  function renderCollisionMode(mode: (typeof collisionModes)[number]): JSX.Element {
    return (
      <Slider.Root
        data-testid={`slider-collision-${mode}`}
        defaultValue={[20, 80]}
        thumbCollisionBehavior={mode}
        style={{ width: '300px', margin: '28px' }}
      >
        <Slider.Label>{mode}</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    );
  }

  return (
    <>
      <For each={collisionModes}>{renderCollisionMode}</For>
    </>
  );
}

/** Expose a change-end callback separately from the live value. */
function SliderChangeEndExample(): JSX.Element {
  const [ended, setEnded] = createSignal('none');

  /** Record the committed value after pointer or keyboard interaction. */
  function handleChangeEnd(details: { value: number[] }): void {
    setEnded(details.value.join(','));
  }

  return (
    <>
      <Slider.Root
        defaultValue={[30]}
        step={5}
        onValueChangeEnd={handleChangeEnd}
        style={{ width: '300px', margin: '28px' }}
      >
        <Slider.Label>Change end</Slider.Label>
        <Slider.Control data-testid="slider-end-control">
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <output data-testid="slider-end-value">{ended()}</output>
    </>
  );
}

/** Show all size, variant, and orientation combinations for visual checks. */
function SliderMatrixExample(): JSX.Element {
  /** Render one CSS combination with a stable browser selector. */
  function renderCase(entry: (typeof matrixCases)[number]): JSX.Element {
    return (
      <Slider.Root
        data-testid={`slider-matrix-${entry.size}-${entry.variant}-${entry.orientation}`}
        size={entry.size}
        variant={entry.variant}
        orientation={entry.orientation}
        defaultValue={[30]}
        style={{ width: '220px', height: entry.orientation === 'vertical' ? '160px' : 'auto' }}
      >
        <Slider.Label>{`${entry.size} ${entry.variant} ${entry.orientation}`}</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    );
  }

  return (
    <>
      <div style={{ display: 'grid', 'grid-template-columns': 'repeat(3, 240px)', gap: '24px' }}>
        <For each={matrixCases}>{renderCase}</For>
      </div>
    </>
  );
}

/** Show finite responsive appearance without remounting the Slider machine. */
function SliderResponsiveExample(): JSX.Element {
  return (
    <>
      <Slider.Root
        data-testid="slider-responsive"
        size={{ base: 'sm', md: 'lg' }}
        variant={{ base: 'outline', md: 'solid' }}
        defaultValue={[35]}
        style={{ width: '240px' }}
      >
        <Slider.Label>Responsive</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </>
  );
}

/** Exercise selected native tags, child composition, and unstyled behavior. */
function SliderNativeExample(): JSX.Element {
  /** Prove the root's selected native element receives its ref. */
  function markRoot(element: Element): void {
    element.setAttribute('data-root-ref', 'true');
  }

  /** Prove the child-rendered thumb receives its ref. */
  function markThumb(element: Element): void {
    element.setAttribute('data-thumb-ref', 'true');
  }

  return (
    <>
      <Slider.Root as="section" unstyled defaultValue={[20]} ref={markRoot}>
        <Slider.Label>Native value</Slider.Label>
        <Slider.Control>
          <Slider.Track data-testid="slider-native-track">
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb
            index={0}
            ref={markThumb}
            asChild={
              /** Preserve the primitive slider behavior on a caller-rendered div. */
              (getProps) => <div {...getProps()} data-testid="slider-native-thumb" />
            }
          >
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    </>
  );
}

const meta = {
  title: 'Components/Slider correctness',
  component: SliderCollisionExample,
} satisfies Meta<typeof SliderCollisionExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Collisions: Story = {};
export const ChangeEnd: Story = { render: SliderChangeEndExample };
export const Matrix: Story = { render: SliderMatrixExample };
export const Responsive: Story = { render: SliderResponsiveExample };
export const Native: Story = { render: SliderNativeExample };
