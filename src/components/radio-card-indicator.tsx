import { splitProps } from '../primitives/utils/split-props';
import { Show } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { useRadioCardItemContext } from './radio-card-machine';
import { renderRadioCardPart } from './radio-card-part';
import type { RadioCardCheckedRender, RadioCardItemIndicatorProps } from './radio-card-part-props';

type ItemContext = ReturnType<typeof useRadioCardItemContext>;

interface IndicatorBranchProps {
  attrs: object;
  item: ItemContext;
}

/** Render the radio dot without caller-provided children. */
function DefaultIndicator(props: IndicatorBranchProps): JSX.Element {
  const partProps = mergeProps(
    {
      /** Style the selected default indicator from machine state. */
      get 'data-checked'() {
        return props.item().checked ? '' : undefined;
      },
      /** Style a disabled default indicator from machine state. */
      get 'data-disabled'() {
        return props.item().disabled ? '' : undefined;
      },
    },
    /** Follow changing caller attributes through the active branch. */
    () => props.attrs,
    {
      'aria-hidden': 'true',
      children: (
        <Show when={props.item().checked}>
          <span class="dot lui-radiomark__dot" />
        </Show>
      ),
    },
  );
  return renderRadioCardPart({ slot: 'itemIndicator', props: partProps });
}

/** Style the caller's checked element directly through the primitive's child renderer. */
function CheckedIndicator(
  props: IndicatorBranchProps & { checked: RadioCardCheckedRender },
): JSX.Element {
  const partProps = mergeProps(
    /** Follow changing caller attributes through the active branch. */
    () => props.attrs,
    {
      'aria-hidden': 'true',
      /** Keep disabled appearance reactive for custom indicators. */
      get 'data-disabled'() {
        return props.item().disabled ? '' : undefined;
      },
      /** Forward the selected element as the indicator root. */
      get asChild() {
        return props.checked;
      },
      /** Never expose ordinary indicator children in the checked branch. */
      get children() {
        return undefined;
      },
    },
  );
  return renderRadioCardPart({ slot: 'itemIndicator', props: partProps });
}

/** Show a radio dot or style a caller-rendered checked element as the root. */
export function RadioCardItemIndicator<As extends ComponentIntrinsicElement = 'span'>(
  props: RadioCardItemIndicatorProps<As>,
): JSX.Element {
  /** Narrow the two public render modes for Solid's union-heavy split helper. */
  const [local, rest] = splitProps(props as { checked?: RadioCardCheckedRender }, ['checked']);
  const item = useRadioCardItemContext();
  return (
    <Show
      when={item().checked ? local.checked : undefined}
      fallback={<DefaultIndicator attrs={rest} item={item} />}
    >
      {
        /** Mount the custom root only while this item is checked. */
        (checked) => <CheckedIndicator attrs={rest} item={item} checked={checked()} />
      }
    </Show>
  );
}
