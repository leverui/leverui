import { For, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { SliderHiddenInput, useSliderContext } from './slider-machine';
import { renderSliderPart } from './slider-part';
import type { SliderThumbsProps } from './slider-part-props';

/** Render one stable thumb and native input for each machine value. */
export function SliderThumbs<As extends PrimitiveNativeTag = 'div'>(
  props: SliderThumbsProps<As>,
): JSX.Element {
  const slider = useSliderContext();
  /** Bind a stable thumb index while its value changes. */
  function renderThumb(_: Accessor<number>, index: number): JSX.Element {
    const thumbProps = mergeProps(props, {
      index,
      /** Keep the native form input inside its owning thumb. */
      get children() {
        return <SliderHiddenInput />;
      },
    });
    return renderSliderPart({ slot: 'thumb', props: thumbProps });
  }

  return (
    <For keyed={false} each={slider().value}>
      {renderThumb}
    </For>
  );
}
