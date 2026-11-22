import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { TreeViewAppearance } from './tree-view-appearance';
import type {
  TreeNode,
  TreeViewSelectionChangeDetails,
  UseTreeViewProps,
  UseTreeViewReturn,
} from './tree-view-machine';

type RenderStrategyProps = {
  lazyMount?: boolean | undefined;
  unmountOnExit?: boolean | undefined;
};
type TreeViewMachineProps<T extends TreeNode> = Omit<UseTreeViewProps<T>, 'onSelectionChange'> & {
  onSelectionChange?: (details: TreeViewSelectionChangeDetails<T>) => void;
};

export type TreeViewRootBaseProps<T extends TreeNode = TreeNode> = TreeViewMachineProps<T> &
  RenderStrategyProps &
  TreeViewAppearance;

export type TreeViewRootProps<
  T extends TreeNode = TreeNode,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<'div', TreeViewRootBaseProps<T>, As>;

export type TreeViewRootProviderProps<
  T extends TreeNode = TreeNode,
  As extends PrimitiveNativeTag = 'div',
> = PrimitiveNativeElementProps<
  'div',
  { value: UseTreeViewReturn<T> } & RenderStrategyProps & TreeViewAppearance,
  As
>;
