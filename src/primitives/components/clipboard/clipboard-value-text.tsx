import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

export type ClipboardValueTextBaseProps = PolymorphicProps<'span'>;
export type ClipboardValueTextProps = Assign<HTMLProps<'span'>, ClipboardValueTextBaseProps>;

/** Render the Clipboard value text. */
export const ClipboardValueText = (props: ClipboardValueTextProps) => {
  const api = useClipboardContext();
  const mergedProps = mergeProps(props);

  return <primitive.span {...mergedProps}>{props.children || api().value}</primitive.span>;
};
