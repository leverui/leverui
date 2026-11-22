import { Pagination as PrimitivePagination } from '../primitives/components/pagination';

/** Match each styled Pagination slot to the primitive's default native element. */
export const paginationPartTags = {
  ellipsis: 'div',
  item: 'button',
  nextTrigger: 'button',
  prevTrigger: 'button',
} as const;

export type PaginationPartSlot = keyof typeof paginationPartTags;

/** Keep the primitive behavior behind the matching Lever UI part name. */
export const paginationPartComponents = {
  ellipsis: PrimitivePagination.Ellipsis,
  item: PrimitivePagination.Item,
  nextTrigger: PrimitivePagination.NextTrigger,
  prevTrigger: PrimitivePagination.PreviousTrigger,
} as const;
