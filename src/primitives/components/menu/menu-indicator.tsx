import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';

export type MenuIndicatorBaseProps = PolymorphicProps<'span'>;
export type MenuIndicatorProps = Assign<HTMLProps<'span'>, MenuIndicatorBaseProps>;

/** Render the Menu indicator. */
export const MenuIndicator = (props: MenuIndicatorProps) => {
  const context = useMenuContext();
  const mergedProps = mergeProps(() => context().getIndicatorProps(), props);

  return <primitive.span {...mergedProps} />;
};
