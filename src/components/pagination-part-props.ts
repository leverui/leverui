import type { Pagination as PrimitivePagination } from '../primitives/components/pagination';
import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

type ItemBehavior = Pick<PrimitivePagination.ItemBaseProps, 'type' | 'value'>;
type EllipsisBehavior = Pick<PrimitivePagination.EllipsisBaseProps, 'index'>;
type AnchorAttributes = Omit<
  JSX.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof JSX.ButtonHTMLAttributes<HTMLButtonElement> | 'ref'
>;
type LinkRef =
  | JSX.ButtonHTMLAttributes<HTMLButtonElement>['ref']
  | JSX.AnchorHTMLAttributes<HTMLAnchorElement>['ref'];
type NativeLinkRef<Props> = Props extends { as?: never; asChild?: never }
  ? Omit<Props, 'ref'> & { ref?: LinkRef }
  : Props;
/** Keep both native ref types available because the root selects the rendered tag. */
type LinkCapableProps<Behavior, As extends PrimitiveNativeTag> = NativeLinkRef<
  PrimitiveNativeElementProps<'button', Behavior & PaginationPartAppearance, As>
> &
  AnchorAttributes;

export interface PaginationPartAppearance {
  unstyled?: boolean | undefined;
  className?: string | undefined;
}

export type PaginationEllipsisProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', EllipsisBehavior & PaginationPartAppearance, As>;
export type PaginationItemProps<As extends PrimitiveNativeTag = 'button'> = LinkCapableProps<
  ItemBehavior,
  As
>;
export type PaginationNextTriggerProps<As extends PrimitiveNativeTag = 'button'> = LinkCapableProps<
  object,
  As
>;
export type PaginationPrevTriggerProps<As extends PrimitiveNativeTag = 'button'> = LinkCapableProps<
  object,
  As
>;
