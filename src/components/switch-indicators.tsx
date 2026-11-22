import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderSwitchPart, type SwitchRuntimePartProps } from './switch-part';
import type { SwitchIndicatorProps, SwitchThumbIndicatorProps } from './switch-part-props';
import { useSwitchContext } from './switch-machine';

type IndicatorSlot = 'indicator' | 'thumbIndicator';

/** Select checked content and state attributes for either optional indicator. */
function renderSwitchIndicator(
  slot: IndicatorSlot,
  props: SwitchRuntimePartProps & { fallback?: JSX.Element },
): JSX.Element {
  const api = useSwitchContext();
  const [content, rest] = splitProps(props, ['fallback', 'children']);
  const indicatorProps = mergeProps(rest, {
    /** Expose the machine state to the indicator and its recipe. */
    get 'data-checked'() {
      return api().checked ? '' : undefined;
    },
    /** Follow the machine when either content branch changes. */
    get children() {
      return api().checked ? content.children : content.fallback;
    },
  });
  return renderSwitchPart({ slot, props: indicatorProps });
}

/** Render the recipe-styled track indicator. */
function SwitchIndicatorImpl(
  props: SwitchRuntimePartProps & { fallback?: JSX.Element },
): JSX.Element {
  return renderSwitchIndicator('indicator', props);
}

/** Expose the precise native or polymorphic track indicator contract. */
export const SwitchIndicator = SwitchIndicatorImpl as <
  As extends ComponentIntrinsicElement = 'span',
>(
  props: SwitchIndicatorProps<As>,
) => JSX.Element;

/** Render checked or fallback content inside the moving thumb. */
function SwitchThumbIndicatorImpl(
  props: SwitchRuntimePartProps & { fallback?: JSX.Element },
): JSX.Element {
  return renderSwitchIndicator('thumbIndicator', props);
}

/** Expose the precise native or polymorphic thumb indicator contract. */
export const SwitchThumbIndicator = SwitchThumbIndicatorImpl as <
  As extends ComponentIntrinsicElement = 'span',
>(
  props: SwitchThumbIndicatorProps<As>,
) => JSX.Element;
