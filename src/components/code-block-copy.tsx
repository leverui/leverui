import { splitProps } from '../primitives/utils/split-props';
import { mergeProps as mergeZagProps } from '../primitives/utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { primitive } from '../primitives/components/factory';
import { CodeBlockCheckIcon, CodeBlockCopyIcon } from './code-block-icons';
import { useCodeBlockPartStyle } from './code-block-part-style';
import type { CodeBlockCopyIndicatorProps, CodeBlockCopyTriggerProps } from './code-block-props';
import { useCodeBlockContext } from './code-block-state';

/** Connect a styled native copy button to the primitive layer's clipboard machine. */
export function CodeBlockCopyTrigger(props: CodeBlockCopyTriggerProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('copyTrigger', local);
  const triggerProps = mergeZagProps(
    /** Keep clipboard trigger semantics reactive to Zag state. */
    () => state.clipboard().getTriggerProps(),
    rest,
  );
  return (
    <primitive.button
      {...triggerProps}
      type="button"
      class={style.className()}
      data-unstyled={style.unstyled()}
    />
  );
}

/** Switch the copy glyph when Zag reports a successful copy. */
export function CodeBlockCopyIndicator(props: CodeBlockCopyIndicatorProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props, ['copied', 'children', 'class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('copyIndicator', local);
  return (
    <primitive.span {...rest} class={style.className()} data-unstyled={style.unstyled()}>
      {state.clipboard().copied
        ? (local.copied ?? <CodeBlockCheckIcon />)
        : (local.children ?? <CodeBlockCopyIcon />)}
    </primitive.span>
  );
}
