import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';

export type MenuSeparatorBaseProps = PolymorphicProps<'hr'>;
export type MenuSeparatorProps = Assign<HTMLProps<'hr'>, MenuSeparatorBaseProps>;

/** Render the Menu separator. */
export const MenuSeparator = (props: MenuSeparatorProps) => {
  const menu = useMenuContext();
  const mergedProps = mergeProps(() => menu().getSeparatorProps(), props);

  return <primitive.hr {...mergedProps} />;
};
