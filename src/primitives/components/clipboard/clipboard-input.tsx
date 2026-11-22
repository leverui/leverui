import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

export type ClipboardInputBaseProps = PolymorphicProps<'input'>;
export type ClipboardInputProps = Assign<HTMLProps<'input'>, ClipboardInputBaseProps>;

/** Render the Clipboard input. */
export const ClipboardInput = (props: ClipboardInputProps) => {
  const api = useClipboardContext();
  const mergedProps = mergeProps(() => api().getInputProps(), props);

  return <primitive.input {...mergedProps} />;
};
