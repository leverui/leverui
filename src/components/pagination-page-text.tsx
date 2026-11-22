import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { usePaginationUnstyled } from './pagination-appearance';
import { usePaginationContext } from './pagination-machine';

export interface PaginationPageTextFormatDetails {
  page: number;
  totalPages: number;
  pageRange: { start: number; end: number };
  count: number;
}

/** Format the current machine range as caller-owned text. */
export type PaginationPageTextFormatFn = (details: PaginationPageTextFormatDetails) => string;
export type PaginationPageTextFormat = 'short' | 'compact' | 'long' | PaginationPageTextFormatFn;
type PageTextFormatProp = {
  format?: PaginationPageTextFormat;
};
type PageTextAppearance = PageTextFormatProp & {
  unstyled?: boolean | undefined;
  className?: string | undefined;
};
export type PaginationPageTextProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  PageTextAppearance,
  As
>;
type RuntimePageTextProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  PageTextAppearance & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

/** Render the caller's selected native element without presentation insertion. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Convert the current machine range into the requested text format. */
export function formatPaginationPageText(
  details: PaginationPageTextFormatDetails,
  format: PaginationPageTextFormat,
): string {
  if (typeof format === 'function') return format(details);
  if (format === 'short') return `${details.page} / ${details.totalPages}`;
  if (format === 'compact') return `${details.page} of ${details.totalPages}`;
  return `${details.pageRange.start + 1} - ${Math.min(details.pageRange.end, details.count)} of ${details.count}`;
}

/** Render reactive page or item-range text with one stable CSS hook. */
function PaginationPageTextImpl(props: RuntimePageTextProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'format',
    'class',
    'className',
    'unstyled',
    'as',
    'asChild',
    'ref',
  ]);
  const pagination = usePaginationContext();
  const rootUnstyled = usePaginationUnstyled();
  const content = createMemo(
    /** Follow the machine and caller formatter without remounting text. */
    () => formatPaginationPageText(pagination(), local.format ?? 'compact'),
  );

  /** Forward the native text element to the consumer. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep consumer attributes and part hooks reactive. */
    () => ({
      ...native,
      class: composeRecipeClassNames(
        'pagination__page-text',
        undefined,
        local.class,
        local.className,
      ),
      'data-unstyled': local.unstyled || rootUnstyled() ? '' : undefined,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('PaginationPageText', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'div'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Bind the selected native tag to its matching ref type. */
export const PaginationPageText = PaginationPageTextImpl as <As extends NativeElementTag = 'div'>(
  props: PaginationPageTextProps<As>,
) => JSX.Element;
