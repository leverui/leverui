import {
  Slider,
  SliderRoot,
  SliderThumb,
  useSlider,
  type SliderMarksProps,
  type SliderRootProps,
  type SliderThumbProps,
  type SliderThumbsProps,
  type SliderValueChangeDetails,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type RootRejectsCssObject = ExpectFalse<'css' extends keyof SliderRootProps ? true : false>;
export type RootRejectsRecipe = ExpectFalse<'recipe' extends keyof SliderRootProps ? true : false>;
export type ThumbRejectsCssObject = ExpectFalse<
  'css' extends keyof SliderThumbProps ? true : false
>;
export type RootKeepsNativeStyle = ExpectTrue<'style' extends keyof SliderRootProps ? true : false>;
export type RootKeepsResponsiveSize = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, SliderRootProps>
>;
export type MarksKeepsNativeStyle = ExpectTrue<
  'style' extends keyof SliderMarksProps ? true : false
>;
export type SelectedThumbPropsAccepted = ExpectTrue<
  Assignable<{ as: 'button'; type: 'button' }, SliderThumbsProps<'button'>>
>;
export type ThumbIndexInternal = ExpectFalse<
  'index' extends keyof SliderThumbsProps ? true : false
>;
export type ChangeValue = ExpectTrue<Assignable<SliderValueChangeDetails['value'], number[]>>;

/** Exercise direct and compound Slider exports from an isolated install. */
export function SliderConsumer(): JSX.Element {
  return (
    <SliderRoot defaultValue={[30]} size="md" style={{ width: '240px' }}>
      <Slider.Label>Volume</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <SliderThumb index={0}>
          <Slider.HiddenInput />
        </SliderThumb>
      </Slider.Control>
    </SliderRoot>
  );
}

/** Exercise an externally owned primitive machine with native CSS hooks. */
export function SliderStoreConsumer(): JSX.Element {
  const machine = useSlider({ defaultValue: [40] });
  return (
    <Slider.RootProvider value={machine} variant="solid" class="volume-slider">
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.RootProvider>
  );
}

/** Keep native span refs and generated helpers valid in a packed install. */
export function SliderPartConsumer(): JSX.Element {
  const machine = useSlider({ defaultValue: [40], orientation: 'vertical' });

  /** Observe the value text's native span. */
  function captureValueText(element: HTMLSpanElement): void {
    void element;
  }

  /** Observe the dragging indicator's native span. */
  function captureDraggingIndicator(element: HTMLSpanElement): void {
    void element;
  }

  return (
    <Slider.RootProvider value={machine} style={{ height: '160px' }}>
      <Slider.ValueText ref={captureValueText} />
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.DraggingIndicator ref={captureDraggingIndicator} />
          <Slider.HiddenInput />
        </Slider.Thumb>
      </Slider.Control>
      <Slider.Marks marks={[0, 50, 100]} style={{ 'margin-top': '8px' }} />
    </Slider.RootProvider>
  );
}
