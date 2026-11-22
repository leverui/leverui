import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseClipboardReturn } from './use-clipboard';
import { ClipboardProvider } from './use-clipboard-context';

interface RootProviderProps {
  value: UseClipboardReturn;
}

export type ClipboardRootProviderBaseProps = PolymorphicProps<'div'>;
export type ClipboardRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  ClipboardRootProviderBaseProps;

/** Provide the Clipboard root provider to its children. */
export const ClipboardRootProvider = (props: ClipboardRootProviderProps) => {
  const [{ value: clipboard }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => clipboard().getRootProps(), localProps);

  return (
    <ClipboardProvider value={clipboard}>
      <primitive.div {...mergedProps} />
    </ClipboardProvider>
  );
};
