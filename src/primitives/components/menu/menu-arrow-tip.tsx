import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';

export type MenuArrowTipBaseProps = PolymorphicProps<'div'>;
export type MenuArrowTipProps = Assign<HTMLProps<'div'>, MenuArrowTipBaseProps>;

/** Render the Menu arrow tip. */
export const MenuArrowTip = (props: MenuArrowTipProps) => {
  const context = useMenuContext();
  const mergedProps = mergeProps(() => context().getArrowTipProps(), props);

  return <primitive.div {...mergedProps} />;
};
