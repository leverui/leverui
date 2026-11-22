import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

export type ClipboardTriggerBaseProps = PolymorphicProps<'button'>;
export type ClipboardTriggerProps = Assign<HTMLProps<'button'>, ClipboardTriggerBaseProps>;

/** Render the Clipboard trigger. */
export const ClipboardTrigger = (props: ClipboardTriggerProps) => {
  const api = useClipboardContext();
  const mergedProps = mergeProps(() => api().getTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
