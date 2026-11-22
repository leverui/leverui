import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  useSplitterRootProviderProps,
  type SplitterRootProviderProps,
  type SplitterRuntimeProviderProps,
} from './splitter-props';
import { renderSplitterRoot } from './splitter-root-renderer';

/** Render a Splitter around a caller-owned primitive and Zag resize machine. */
function SplitterRootProviderImpl(props: SplitterRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSplitterRootProviderProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the supplied machine context. */
    get children() {
      return content.children;
    },
  });
  const root = renderSplitterRoot({ mode: 'provider', props: forwarded });
  return root;
}

/** Require an external resize machine on provider roots. */
export const SplitterRootProvider = SplitterRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: SplitterRootProviderProps<As>,
) => JSX.Element;
