import {
  Pagination,
  PaginationItem,
  PaginationNextTrigger,
  PaginationRoot,
  usePagination,
  type PaginationContext,
  type PaginationEllipsis,
  type PaginationPageText,
  type PaginationPrevTrigger,
  type PaginationPropsProvider,
  type PaginationRootProvider,
  type usePaginationContext,
  type PaginationEllipsisProps,
  type PaginationItemProps,
  type PaginationItemsProps,
  type PaginationNextTriggerProps,
  type PaginationPageChangeDetails,
  type PaginationPageSizeChangeDetails,
  type PaginationPageTextFormatDetails,
  type PaginationPageTextFormatFn,
  type PaginationPageTextProps,
  type PaginationPrevTriggerProps,
  type PaginationPropsProviderProps,
  type PaginationRootProps,
  type PaginationRootProviderProps,
  type UsePaginationProps,
  type UsePaginationReturn,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type PublicValues = [
  typeof PaginationContext,
  typeof PaginationEllipsis,
  typeof PaginationItem,
  typeof PaginationNextTrigger,
  typeof PaginationPageText,
  typeof PaginationPrevTrigger,
  typeof PaginationPropsProvider,
  typeof PaginationRoot,
  typeof PaginationRootProvider,
  typeof usePagination,
  typeof usePaginationContext,
];
export type PublicTypes = [
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationItemsProps,
  PaginationNextTriggerProps,
  PaginationPageChangeDetails,
  PaginationPageSizeChangeDetails,
  PaginationPageTextFormatDetails,
  PaginationPageTextFormatFn,
  PaginationPageTextProps,
  PaginationPrevTriggerProps,
  PaginationPropsProviderProps,
  PaginationRootProviderProps,
  UsePaginationProps,
  UsePaginationReturn,
];

export type RootAcceptsMachineProps = ExpectTrue<
  Assignable<{ count: number; pageSize: number; defaultPage: number }, PaginationRootProps>
>;
export type RootRejectsCssObjects = ExpectFalse<
  Assignable<{ css: { color: string } }, PaginationRootProps>
>;
export type RootRejectsStyleShorthands = ExpectFalse<
  Assignable<{ maxW: string }, PaginationRootProps>
>;
export type ItemRequiresValue = ExpectFalse<
  Assignable<object, Parameters<typeof PaginationItem>[0]>
>;
export type ItemsRejectPlainEllipsis = ExpectFalse<
  Assignable<JSX.Element, NonNullable<PaginationItemsProps['ellipsis']>>
>;

/** Use link-mode part attributes and custom Solid render callbacks. */
export function PaginationConsumer(): JSX.Element {
  /** Accept the native anchor from a link-mode Pagination part. */
  function receiveAnchor(element: HTMLAnchorElement): void {
    void element.href;
  }

  /** Accept the selected span from the PageText factory. */
  function receiveSpan(element: HTMLSpanElement): void {
    void element.textContent;
  }

  /** Keep the public change detail shape available to consumers. */
  function onPageChange(details: PaginationPageChangeDetails): void {
    void details.page;
  }

  return (
    <PaginationRoot
      type="link"
      count={30}
      pageSize={10}
      defaultPage={2}
      getPageUrl={
        /** Map page requests to URLs in the installed consumer. */
        ({ page }) => `/page/${page}`
      }
      onPageChange={onPageChange}
    >
      <Pagination.PrevTrigger ref={receiveAnchor} target="_blank" rel="noreferrer">
        Prev
      </Pagination.PrevTrigger>
      <PaginationItem type="page" value={1} href="/page/1" ref={receiveAnchor}>
        1
      </PaginationItem>
      <Pagination.Items
        render={
          /** Put machine attributes on caller-owned page buttons. */
          (page, getProps) => <a {...getProps()}>{page.value}</a>
        }
        ellipsis={
          /** Put the ellipsis identity on the supplied native element. */
          (getProps) => <span {...getProps()}>…</span>
        }
      />
      <PaginationNextTrigger ref={receiveAnchor} target="_blank" rel="noreferrer">
        Next
      </PaginationNextTrigger>
      <Pagination.PageText as="span" ref={receiveSpan} format="long" />
    </PaginationRoot>
  );
}

/** Keep the external machine and compound RootProvider contract public. */
export function PaginationStoreConsumer(): JSX.Element {
  const machine = usePagination({ count: 30, pageSize: 10, defaultPage: 2 });
  return (
    <Pagination.RootProvider value={machine}>
      <Pagination.Items />
      <Pagination.PageText />
    </Pagination.RootProvider>
  );
}
