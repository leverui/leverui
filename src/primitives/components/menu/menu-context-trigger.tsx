import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';

export type MenuContextTriggerBaseProps = PolymorphicProps<'button'>;
export type MenuContextTriggerProps = Assign<HTMLProps<'button'>, MenuContextTriggerBaseProps>;

/** Render the Menu context trigger. */
export const MenuContextTrigger = (props: MenuContextTriggerProps) => {
  const context = useMenuContext();
  const mergedProps = mergeProps(() => context().getContextTriggerProps(), props);

  return <primitive.button {...mergedProps} />;
};
