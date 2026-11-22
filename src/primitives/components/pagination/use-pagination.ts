import * as pagination from '@zag-js/pagination';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { HTMLProps } from '../factory';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';

/**
 * The anchor attributes the items and triggers accept, since they render as links under `type="link"`.
 */
export type PaginationAnchorProps = Omit<HTMLProps<'a'>, keyof HTMLProps<'button'>> & {
  ref?:
    HTMLButtonElement | HTMLAnchorElement | ((el: HTMLButtonElement | HTMLAnchorElement) => void);
};

export type UsePaginationProps = Optional<Omit<pagination.Props, 'dir' | 'getRootNode'>, 'id'>;
// zag v2 dropped `type` from the api; the items and triggers read it to pick their element
export interface UsePaginationApi extends pagination.Api<PropTypes> {
  type: NonNullable<pagination.Props['type']>;
}
export type UsePaginationReturn = Accessor<UsePaginationApi>;

/** Create the pagination state and return its API. */
export const usePagination = (props?: MaybeAccessor<UsePaginationProps>): UsePaginationReturn => {
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const id = createUniqueId();

  const machineProps = createMemo<pagination.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(pagination.machine, machineProps);
  return createMemo(() => ({
    ...pagination.connect(service, normalizeProps),
    type: service.prop('type'),
  }));
};
