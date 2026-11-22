import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  useSplitterProps,
  type SplitterRootProps,
  type SplitterRuntimeRootProps,
} from './splitter-props';
import { renderSplitterRoot } from './splitter-root-renderer';

/** Render a native Splitter with a primitive and Zag resize machine. */
function SplitterRootImpl(props: SplitterRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSplitterProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the current machine context. */
    get children() {
      return content.children;
    },
  });
  const root = renderSplitterRoot({ mode: 'root', props: forwarded });
  return root;
}

/** Expose native, selected-tag, and caller-rendered Splitter roots. */
export const SplitterRoot = SplitterRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: SplitterRootProps<As>,
) => JSX.Element;
