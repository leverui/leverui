import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  useMarqueeRootProps,
  useMarqueeRootProviderProps,
  type MarqueeRootProps,
  type MarqueeRootProviderProps,
  type MarqueeRuntimeProviderProps,
  type MarqueeRuntimeRootProps,
} from './marquee-props';
import { renderMarqueeRoot } from './marquee-root-renderer';

/** Render a Marquee with its own responsive primitive and Zag machine. */
function MarqueeRootImpl(props: MarqueeRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useMarqueeRootProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the current machine context. */
    get children() {
      return content.children;
    },
  });
  return renderMarqueeRoot({ mode: 'root', props: forwarded });
}

/** Expose a typed Marquee root with caller-owned element selection. */
export const MarqueeRoot = MarqueeRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: MarqueeRootProps<As>,
) => JSX.Element;

/** Render a Marquee driven by a caller-owned primitive machine accessor. */
function MarqueeRootProviderImpl(props: MarqueeRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useMarqueeRootProviderProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the supplied machine context. */
    get children() {
      return content.children;
    },
  });
  return renderMarqueeRoot({ mode: 'provider', props: forwarded });
}

/** Expose a typed external-machine Marquee root. */
export const MarqueeRootProvider = MarqueeRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: MarqueeRootProviderProps<As>,
) => JSX.Element;
