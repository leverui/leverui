import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseAvatarProps, useAvatar } from './use-avatar';
import { AvatarProvider } from './use-avatar-context';

export type AvatarRootBaseProps = UseAvatarProps & PolymorphicProps<'span'>;
export type AvatarRootProps = Assign<HTMLProps<'span'>, AvatarRootBaseProps>;

/** Render the Avatar root. */
export const AvatarRoot = (props: AvatarRootProps) => {
  const [useAvatarProps, localProps] = createSplitProps<UseAvatarProps>()(props, [
    'id',
    'ids',
    'onStatusChange',
  ]);

  const context = useAvatar(useAvatarProps);
  const mergedProps = mergeProps(() => context().getRootProps(), localProps);

  return (
    <AvatarProvider value={context}>
      <primitive.span {...mergedProps} />
    </AvatarProvider>
  );
};
