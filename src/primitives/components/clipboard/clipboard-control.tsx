import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

export type ClipboardControlBaseProps = PolymorphicProps<'div'>;
export type ClipboardControlProps = Assign<HTMLProps<'div'>, ClipboardControlBaseProps>;

/** Render the Clipboard control. */
export const ClipboardControl = (props: ClipboardControlProps) => {
  const api = useClipboardContext();
  const mergedProps = mergeProps(() => api().getControlProps(), props);

  return <primitive.div {...mergedProps} />;
};
