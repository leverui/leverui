import type { Assign } from '../../types';
import type { EllipsisProps } from '@zag-js/pagination';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { usePaginationContext } from './use-pagination-context';

export type PaginationEllipsisBaseProps = EllipsisProps & PolymorphicProps<'div'>;
export type PaginationEllipsisProps = Assign<HTMLProps<'div'>, PaginationEllipsisBaseProps>;

/** Render the Pagination ellipsis. */
export const PaginationEllipsis = (props: PaginationEllipsisProps) => {
  const [ellipsisProps, localProps] = createSplitProps<EllipsisProps>()(props, ['index']);

  const api = usePaginationContext();
  const mergedProps = mergeProps(() => api().getEllipsisProps(ellipsisProps), localProps);

  return <primitive.div {...mergedProps} />;
};
