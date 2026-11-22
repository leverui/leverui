import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UsePaginationProps, usePagination } from './use-pagination';
import { PaginationProvider } from './use-pagination-context';

export type PaginationRootBaseProps = UsePaginationProps & PolymorphicProps<'nav'>;
export type PaginationRootProps = Assign<HTMLProps<'nav'>, PaginationRootBaseProps>;

/** Render the Pagination root. */
export const PaginationRoot = (props: PaginationRootProps) => {
  const [usePaginationProps, localProps] = createSplitProps<UsePaginationProps>()(props, [
    'boundaryCount',
    'count',
    'defaultPage',
    'defaultPageSize',
    'getPageUrl',
    'id',
    'ids',
    'onPageChange',
    'onPageSizeChange',
    'page',
    'pageSize',
    'siblingCount',
    'translations',
    'type',
  ]);
  const api = usePagination(usePaginationProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <PaginationProvider value={api}>
      <primitive.nav {...mergedProps} />
    </PaginationProvider>
  );
};
