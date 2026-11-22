import { type JSX } from '@solidjs/web';
import { type UsePaginationContext, usePaginationContext } from './use-pagination-context';

export interface PaginationContextProps {
  children: (context: UsePaginationContext) => JSX.Element;
}

/** Render the Pagination context context through a function child. */
export const PaginationContext = (props: PaginationContextProps) =>
  props.children(usePaginationContext());
