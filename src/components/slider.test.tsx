import { cleanup, render, screen } from '@solidjs/testing-library';
import { settle } from '../../tests/settle';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { Slider } from '../index';

afterEach(cleanup);

/** Supply the layout observer unavailable in jsdom's DOM implementation. */
class TestResizeObserver implements ResizeObserver {
  /** Ignore layout changes in source rendering checks. */
  observe(): void {}
  /** Ignore removed elements in source rendering checks. */
  unobserve(): void {}
  /** Release all observed elements in source rendering checks. */
  disconnect(): void {}
}

/** Install the browser observer required by Zag's thumb sizing effect. */
function installResizeObserver(): void {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
}

/** Restore the DOM environment after these source checks. */
function restoreResizeObserver(): void {
  vi.unstubAllGlobals();
}

beforeAll(installResizeObserver);
afterAll(restoreResizeObserver);

/** Mount the default Slider composition through its published compound API. */
function DefaultSlider() {
  return (
    <>
      <form data-testid="slider-form">
        <Slider.Root name="volume" defaultValue={[30]}>
          <Slider.Label>Volume</Slider.Label>
          <Slider.ValueText />
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </form>
    </>
  );
}

/** Verify accessibility, form submission, and all styled machine parts. */
async function verifiesSliderComposition(): Promise<void> {
  render(
    /** Keep the default composition under one reactive provider. */
    () => <DefaultSlider />,
  );
  // Zag measures the thumbs once its machine starts.
  await settle();
  const thumb = screen.getByRole('slider', { name: 'Volume' });
  expect(thumb).toHaveAttribute('aria-valuenow', '30');
  expect(thumb).toHaveClass('leverui-slider__thumb');
  expect(screen.getByText('Volume').closest('[data-slider-root]')).toHaveClass(
    'leverui-slider__root',
  );
  expect(document.querySelector('.leverui-slider__track')).not.toBeNull();
  expect(document.querySelector('.leverui-slider__range')).not.toBeNull();
  expect(new FormData(screen.getByTestId('slider-form') as HTMLFormElement).get('volume')).toBe(
    '30',
  );
}

it('renders the styled Slider with an accessible native form value', verifiesSliderComposition);

/** Keep the default helpers bound to their machine positions. */
async function verifiesRangeHelpers(): Promise<void> {
  render(
    /** Mount generated thumbs and labeled marks under one machine. */
    () => (
      <>
        <Slider.Root defaultValue={[20, 80]} minStepsBetweenThumbs={10}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
          <Slider.Marks marks={[0, { value: 50, label: 'Middle' }, 100]} />
        </Slider.Root>
      </>
    ),
  );
  // Zag measures the thumbs once its machine starts.
  await settle();
  expect(screen.getAllByRole('slider')).toHaveLength(2);
  expect(document.querySelectorAll('input[type="text"]')).toHaveLength(2);
  expect(screen.getByText('Middle')).toHaveClass('leverui-slider__markerLabel');
  expect(document.querySelectorAll('.leverui-slider__marker')).toHaveLength(3);
}

it('renders one native input per thumb and labeled marks', verifiesRangeHelpers);

/** Keep default part refs aligned with the native elements the primitive renders. */
async function verifiesSpanPartRefs(): Promise<void> {
  let valueNode: HTMLSpanElement | undefined;
  let indicatorNode: HTMLSpanElement | undefined;

  /** Capture the default ValueText native element. */
  function captureValue(node: HTMLSpanElement): void {
    valueNode = node;
  }

  /** Capture the default DraggingIndicator native element. */
  function captureIndicator(node: HTMLSpanElement): void {
    indicatorNode = node;
  }

  render(
    /** Keep the indicator inside its owning thumb context. */
    () => (
      <>
        <Slider.Root defaultValue={[30]}>
          <Slider.ValueText ref={captureValue} />
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.DraggingIndicator ref={captureIndicator} />
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </>
    ),
  );
  // Zag measures the thumbs once its machine starts.
  await settle();
  expect(valueNode).toBeInstanceOf(HTMLSpanElement);
  expect(indicatorNode).toBeInstanceOf(HTMLSpanElement);
}

it('exposes span refs for value text and the dragging indicator', verifiesSpanPartRefs);
