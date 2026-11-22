import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useAvatarContext } from './use-avatar-context';

export type AvatarFallbackBaseProps = PolymorphicProps<'span'>;
export type AvatarFallbackProps = Assign<HTMLProps<'span'>, AvatarFallbackBaseProps>;

/** Render the Avatar fallback. */
export const AvatarFallback = (props: AvatarFallbackProps) => {
  const context = useAvatarContext();
  const mergedProps = mergeProps(() => context().getFallbackProps(), props);
  return <primitive.span {...mergedProps} />;
};
