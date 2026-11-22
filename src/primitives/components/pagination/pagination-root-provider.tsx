import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UsePaginationReturn } from './use-pagination';
import { PaginationProvider } from './use-pagination-context';

interface RootProviderProps {
  value: UsePaginationReturn;
}

export type PaginationRootProviderBaseProps = PolymorphicProps<'nav'>;
export type PaginationRootProviderProps = HTMLProps<'nav'> &
  RootProviderProps &
  PaginationRootProviderBaseProps;

/** Provide the Pagination root provider to its children. */
export const PaginationRootProvider = (props: PaginationRootProviderProps) => {
  const [{ value: pagination }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => pagination().getRootProps(), localProps);

  return (
    <PaginationProvider value={pagination}>
      <primitive.nav {...mergedProps} />
    </PaginationProvider>
  );
};
