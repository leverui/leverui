import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseClipboardProps, useClipboard } from './use-clipboard';
import { ClipboardProvider } from './use-clipboard-context';

export type ClipboardRootBaseProps = UseClipboardProps & PolymorphicProps<'div'>;
export type ClipboardRootProps = Assign<HTMLProps<'div'>, ClipboardRootBaseProps>;

/** Render the Clipboard root. */
export const ClipboardRoot = (props: ClipboardRootProps) => {
  const [useClipboardProps, localProps] = createSplitProps<UseClipboardProps>()(props, [
    'defaultValue',
    'id',
    'ids',
    'onStatusChange',
    'onValueChange',
    'timeout',
    'translations',
    'value',
  ]);
  const api = useClipboard(useClipboardProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <ClipboardProvider value={api}>
      <primitive.div {...mergedProps} />
    </ClipboardProvider>
  );
};
