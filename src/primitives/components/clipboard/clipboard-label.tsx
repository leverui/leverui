import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useClipboardContext } from './use-clipboard-context';

export type ClipboardLabelBaseProps = PolymorphicProps<'label'>;
export type ClipboardLabelProps = Assign<HTMLProps<'label'>, ClipboardLabelBaseProps>;

/** Render the Clipboard label. */
export const ClipboardLabel = (props: ClipboardLabelProps) => {
  const api = useClipboardContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
