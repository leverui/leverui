import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';

export type MenuArrowBaseProps = PolymorphicProps<'div'>;
export type MenuArrowProps = Assign<HTMLProps<'div'>, MenuArrowBaseProps>;

/** Render the Menu arrow. */
export const MenuArrow = (props: MenuArrowProps) => {
  const context = useMenuContext();
  const mergedProps = mergeProps(() => context().getArrowProps(), props);

  return <primitive.div {...mergedProps} />;
};
