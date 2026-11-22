import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useAvatarContext } from './use-avatar-context';

export type AvatarImageBaseProps = PolymorphicProps<'img'>;
export type AvatarImageProps = Assign<HTMLProps<'img'>, AvatarImageBaseProps>;

/** Render the Avatar image. */
export const AvatarImage = (props: AvatarImageProps) => {
  const context = useAvatarContext();
  const mergedProps = mergeProps(() => context().getImageProps(), props);
  return <primitive.img {...mergedProps} />;
};
