import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import { DrawerActionTrigger, type DrawerActionTriggerProps } from './drawer-action-trigger';
import { DialogBody, DialogFooter, DialogHeader } from './dialog-layout-parts';
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogTitle,
  DialogTrigger,
} from './dialog-parts';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

type DrawerPartProps<
  Tag extends PrimitiveNativeTag,
  As extends PrimitiveNativeTag = Tag,
> = PrimitiveNativeElementProps<Tag, NativeHtmlAliases & { unstyled?: boolean }, As>;
type DrawerPartComponent<Tag extends PrimitiveNativeTag> = {
  <As extends PrimitiveNativeTag>(props: DrawerPartProps<Tag, As> & { as: As }): JSX.Element;
  (props: DrawerPartProps<Tag>): JSX.Element;
};
type DrawerLayoutProps<As extends NativeElementTag = 'div'> = NativeElementProps<
  'div',
  NativeHtmlAliases & { unstyled?: boolean },
  As
>;
type DrawerLayoutComponent = {
  <As extends NativeElementTag>(props: DrawerLayoutProps<As> & { as: As }): JSX.Element;
  (props: DrawerLayoutProps): JSX.Element;
};

export type DrawerTriggerProps<As extends PrimitiveNativeTag = 'button'> = DrawerPartProps<
  'button',
  As
>;
export type DrawerBackdropProps<As extends PrimitiveNativeTag = 'div'> = DrawerPartProps<'div', As>;
export type DrawerPositionerProps<As extends PrimitiveNativeTag = 'div'> = DrawerPartProps<
  'div',
  As
>;
export type DrawerContentProps<As extends PrimitiveNativeTag = 'div'> = DrawerPartProps<'div', As>;
export type DrawerTitleProps<As extends PrimitiveNativeTag = 'h2'> = DrawerPartProps<'h2', As>;
export type DrawerDescriptionProps<As extends PrimitiveNativeTag = 'div'> = DrawerPartProps<
  'div',
  As
>;
export type DrawerCloseTriggerProps<As extends PrimitiveNativeTag = 'button'> = DrawerPartProps<
  'button',
  As
>;
export type DrawerHeaderProps<As extends NativeElementTag = 'div'> = DrawerLayoutProps<As>;
export type DrawerBodyProps<As extends NativeElementTag = 'div'> = DrawerLayoutProps<As>;
export type DrawerFooterProps<As extends NativeElementTag = 'div'> = DrawerLayoutProps<As>;

// These native signatures narrow the shared Dialog renderers at the public boundary.
// Solid's element-specific event handlers prevent direct function assignment.
/** Expose the primitive's trigger through Drawer native props. */
export const DrawerTrigger = DialogTrigger as DrawerPartComponent<'button'>;
/** Expose the backdrop without style-object props. */
export const DrawerBackdrop = DialogBackdrop as DrawerPartComponent<'div'>;
/** Expose the positioner without style-object props. */
export const DrawerPositioner = DialogPositioner as DrawerPartComponent<'div'>;
/** Expose accessible content with native styling hooks. */
export const DrawerContent = DialogContent as DrawerPartComponent<'div'>;
/** Expose the associated title as a native heading. */
export const DrawerTitle = DialogTitle as DrawerPartComponent<'h2'>;
/** Expose the associated description as a native element. */
export const DrawerDescription = DialogDescription as DrawerPartComponent<'div'>;
/** Expose the primitive's close behavior through native props. */
export const DrawerCloseTrigger = DialogCloseTrigger as DrawerPartComponent<'button'>;

/** Expose the header layout with native element props. */
export const DrawerHeader = DialogHeader as DrawerLayoutComponent;
/** Expose the body layout with native element props. */
export const DrawerBody = DialogBody as DrawerLayoutComponent;
/** Expose the footer layout with native element props. */
export const DrawerFooter = DialogFooter as DrawerLayoutComponent;

export { DrawerActionTrigger };
export type { DrawerActionTriggerProps };
