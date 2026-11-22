import { splitProps } from '../primitives/utils/split-props';
import { mergeProps as mergeZagProps } from '../primitives/utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { primitive } from '../primitives/components/factory';
import { CodeBlockChevronDownIcon, CodeBlockChevronUpIcon } from './code-block-icons';
import { useCodeBlockPartStyle } from './code-block-part-style';
import type {
  CodeBlockCollapseIndicatorProps,
  CodeBlockCollapseTextProps,
  CodeBlockCollapseTriggerProps,
} from './code-block-props';
import { useCodeBlockContext } from './code-block-state';

/** Toggle Code Block's disclosure state with a native, labelled button. */
export function CodeBlockCollapseTrigger(props: CodeBlockCollapseTriggerProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props, ['aria-label', 'class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('collapseTrigger', local);
  /** Honor a consumer-cancelled click before changing disclosure state. */
  function handleClick(event: MouseEvent): void {
    if (!event.defaultPrevented) state.collapsible.toggleCollapsed();
  }
  const triggerProps = mergeZagProps({ onClick: handleClick }, rest);
  return (
    <primitive.button
      {...triggerProps}
      type="button"
      aria-controls={state.collapsible.contentId()}
      aria-expanded={state.collapsible.collapsed() ? 'false' : 'true'}
      aria-label={
        local['aria-label'] ??
        (state.collapsible.collapsed() ? 'Expand code block' : 'Collapse code block')
      }
      class={style.className()}
      data-unstyled={style.unstyled()}
    />
  );
}

/** Select an expanded or collapsed glyph from the current disclosure state. */
export function CodeBlockCollapseIndicator(props: CodeBlockCollapseIndicatorProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props, [
    'collapsed',
    'children',
    'class',
    'className',
    'unstyled',
  ]);
  const style = useCodeBlockPartStyle('collapseIndicator', local);
  return (
    <primitive.span {...rest} class={style.className()} data-unstyled={style.unstyled()}>
      {state.collapsible.collapsed()
        ? (local.collapsed ?? <CodeBlockChevronDownIcon />)
        : (local.children ?? <CodeBlockChevronUpIcon />)}
    </primitive.span>
  );
}

/** Render the default expand and collapse text labels. */
export function CodeBlockCollapseText(props: CodeBlockCollapseTextProps): JSX.Element {
  const [local, rest] = splitProps(props, ['children']);
  return (
    <CodeBlockCollapseIndicator {...rest} collapsed="Expand code">
      {local.children || 'Collapse code'}
    </CodeBlockCollapseIndicator>
  );
}
