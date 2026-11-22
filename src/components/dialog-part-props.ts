import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';

export type DialogTag = 'button' | 'div' | 'h2';
export type DialogPartProps<
  Tag extends DialogTag,
  As extends PrimitiveNativeTag = Tag,
> = PrimitiveNativeElementProps<Tag, NativeHtmlAliases & { unstyled?: boolean }, As>;

/** Keep the primitive adapter inputs separate from the selected native public contract. */
export type DialogRuntimeProps<Tag extends DialogTag> = Omit<JSX.IntrinsicElements[Tag], 'ref'> &
  NativeHtmlAliases & {
    className?: string | undefined;
    unstyled?: boolean | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

export interface DialogPartPropsBySlot {
  trigger: DialogRuntimeProps<'button'>;
  backdrop: DialogRuntimeProps<'div'>;
  positioner: DialogRuntimeProps<'div'>;
  content: DialogRuntimeProps<'div'>;
  title: DialogRuntimeProps<'h2'>;
  description: DialogRuntimeProps<'div'>;
  closeTrigger: DialogRuntimeProps<'button'>;
}

export type DialogPartInput = DialogPartPropsBySlot[keyof DialogPartPropsBySlot];
