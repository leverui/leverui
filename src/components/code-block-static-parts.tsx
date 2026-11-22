import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import { primitive } from '../primitives/components/factory';
import { useCodeBlockPartStyle } from './code-block-part-style';
import type {
  CodeBlockControlProps,
  CodeBlockFooterProps,
  CodeBlockHeaderProps,
  CodeBlockTitleProps,
} from './code-block-props';

/** Render the native Code Block header with its current slot styles. */
export function CodeBlockHeader(props: CodeBlockHeaderProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('header', local);
  return <primitive.header {...rest} class={style.className()} data-unstyled={style.unstyled()} />;
}

/** Render a Code Block title in a div. */
export function CodeBlockTitle(props: CodeBlockTitleProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('title', local);
  return <primitive.div {...rest} class={style.className()} data-unstyled={style.unstyled()} />;
}

/** Group Code Block action controls in their native div slot. */
export function CodeBlockControl(props: CodeBlockControlProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('control', local);
  return <primitive.div {...rest} class={style.className()} data-unstyled={style.unstyled()} />;
}

/** Render the footer as a native div. */
export function CodeBlockFooter(props: CodeBlockFooterProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('footer', local);
  return <primitive.div {...rest} class={style.className()} data-unstyled={style.unstyled()} />;
}
