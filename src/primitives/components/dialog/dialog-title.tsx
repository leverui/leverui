import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useDialogContext, useDialogLabelParts } from './use-dialog-context';

export type DialogTitleBaseProps = PolymorphicProps<'h2'>;
export type DialogTitleProps = Assign<HTMLProps<'h2'>, DialogTitleBaseProps>;

/** Render the Dialog title. */
export const DialogTitle = (props: DialogTitleProps) => {
  const dialog = useDialogContext();
  useDialogLabelParts()?.register('title');
  const mergedProps = mergeProps(() => dialog().getTitleProps(), props);

  return <primitive.h2 {...mergedProps} />;
};
