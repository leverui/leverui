import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { primitive } from '../primitives/components/factory';
import { useCodeBlockPartStyle } from './code-block-part-style';
import type { CodeBlockContentProps, CodeBlockOverlayProps } from './code-block-props';
import { useCodeBlockContext } from './code-block-state';

/** Render Code Block's collapsible content with stable native disclosure attributes. */
export function CodeBlockContent(props: CodeBlockContentProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props as CodeBlockContentProps & { id?: string }, [
    'id',
    'class',
    'className',
    'unstyled',
  ]);
  /** Keep the managed ID reactive and reject a conflicting Content ID. */
  function resolveContentId(): string {
    if (local.id !== undefined) {
      throw new Error('Set contentId on CodeBlockRoot to customize the Content ID.');
    }
    return state.collapsible.contentId();
  }
  const contentId = createMemo(resolveContentId);
  const style = useCodeBlockPartStyle('content', local);
  return (
    <primitive.div
      {...rest}
      id={contentId()}
      data-expanded={state.collapsible.collapsed() ? undefined : ''}
      aria-expanded={state.collapsible.collapsed() ? 'false' : 'true'}
      class={style.className()}
      data-unstyled={style.unstyled()}
    />
  );
}

/** Render the fade overlay while Code Block content is collapsed. */
export function CodeBlockOverlay(props: CodeBlockOverlayProps): JSX.Element {
  const state = useCodeBlockContext();
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('overlay', local);
  return (
    <primitive.div
      {...rest}
      data-expanded={state.collapsible.collapsed() ? undefined : ''}
      class={style.className()}
      data-unstyled={style.unstyled()}
    />
  );
}
