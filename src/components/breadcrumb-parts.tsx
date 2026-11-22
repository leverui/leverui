import { type JSX } from '@solidjs/web';
import { BreadcrumbChevronIcon, BreadcrumbEllipsisIcon } from './breadcrumb-icons';
import { renderBreadcrumbPart } from './breadcrumb-part';
import type {
  BreadcrumbCurrentLinkProps,
  BreadcrumbEllipsisProps,
  BreadcrumbLinkProps,
  BreadcrumbPartRuntimeProps,
  BreadcrumbSeparatorProps,
} from './breadcrumb-props';
import type { NativeElementTag } from './native-element-props';

export { BreadcrumbList } from './breadcrumb-list';
export { BreadcrumbItem } from './breadcrumb-item';

/** Render a navigable ancestor location. */
function BreadcrumbLinkComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
  return renderBreadcrumbPart('BreadcrumbLink', 'a', 'link', props);
}

/** Expose native anchor attributes and caller-owned links. */
export const BreadcrumbLink = BreadcrumbLinkComponent as <As extends NativeElementTag = 'a'>(
  props: BreadcrumbLinkProps<As>,
) => JSX.Element;

/** Mark the current location as a page link without navigation. */
function BreadcrumbCurrentLinkComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
  return renderBreadcrumbPart('BreadcrumbCurrentLink', 'span', 'currentLink', props, {
    role: 'link',
    'aria-current': 'page',
  });
}

/** Expose current-page semantics on a native or caller-owned element. */
export const BreadcrumbCurrentLink = BreadcrumbCurrentLinkComponent as <
  As extends NativeElementTag = 'span',
>(
  props: BreadcrumbCurrentLinkProps<As>,
) => JSX.Element;

/** Render the hidden default separator chevron. */
function BreadcrumbSeparatorComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
  return renderBreadcrumbPart(
    'BreadcrumbSeparator',
    'li',
    'separator',
    props,
    { 'aria-hidden': 'true' },
    BreadcrumbChevronIcon,
  );
}

/** Expose a decorative separator with replaceable content. */
export const BreadcrumbSeparator = BreadcrumbSeparatorComponent as <
  As extends NativeElementTag = 'li',
>(
  props: BreadcrumbSeparatorProps<As>,
) => JSX.Element;

/** Render the presentational default overflow dots. */
function BreadcrumbEllipsisComponent(props: BreadcrumbPartRuntimeProps): JSX.Element {
  return renderBreadcrumbPart(
    'BreadcrumbEllipsis',
    'li',
    'ellipsis',
    props,
    { role: 'presentation', 'aria-hidden': 'true' },
    BreadcrumbEllipsisIcon,
  );
}

/** Expose a decorative overflow item with replaceable content. */
export const BreadcrumbEllipsis = BreadcrumbEllipsisComponent as <
  As extends NativeElementTag = 'li',
>(
  props: BreadcrumbEllipsisProps<As>,
) => JSX.Element;
