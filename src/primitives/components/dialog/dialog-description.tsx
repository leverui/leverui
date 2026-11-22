import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDialogContext, useDialogLabelParts } from './use-dialog-context';

export type DialogDescriptionBaseProps = PolymorphicProps<'div'>;
export type DialogDescriptionProps = Assign<HTMLProps<'div'>, DialogDescriptionBaseProps>;

/** Render the Dialog description. */
export const DialogDescription = (props: DialogDescriptionProps) => {
  const dialog = useDialogContext();
  useDialogLabelParts()?.register('description');
  const mergedProps = mergeProps(() => dialog().getDescriptionProps(), props);

  return <primitive.div {...mergedProps} />;
};
