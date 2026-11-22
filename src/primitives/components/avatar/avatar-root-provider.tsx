import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseAvatarReturn } from './use-avatar';
import { AvatarProvider } from './use-avatar-context';

interface RootProviderProps {
  value: UseAvatarReturn;
}

export type AvatarRootProviderBaseProps = PolymorphicProps<'span'>;
export type AvatarRootProviderProps = HTMLProps<'span'> &
  RootProviderProps &
  AvatarRootProviderBaseProps;

/** Provide the Avatar root provider to its children. */
export const AvatarRootProvider = (props: AvatarRootProviderProps) => {
  const [{ value: avatar }, localProps] = createSplitProps<RootProviderProps>()(props, ['value']);
  const mergedProps = mergeProps(() => avatar().getRootProps(), localProps);

  return (
    <AvatarProvider value={avatar}>
      <primitive.span {...mergedProps} />
    </AvatarProvider>
  );
};
