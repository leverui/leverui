import { splitProps } from '../primitives/utils/split-props';
import { QrCode as PrimitiveQrCode } from '../primitives/components/qr-code';
import type { PolymorphicProps } from '../primitives/components/factory';
import type { DownloadTriggerProps } from '@zag-js/qr-code';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useQrCodeAppearance } from './qr-code-appearance';
import type { ClassValue } from '../utils/class-value';

type QrCodePartSlot = 'frame' | 'pattern' | 'overlay' | 'downloadTrigger';
const partTags = {
  frame: 'svg',
  pattern: 'path',
  overlay: 'div',
  downloadTrigger: 'button',
} as const satisfies Record<QrCodePartSlot, PrimitiveNativeTag>;
const partComponents = {
  frame: PrimitiveQrCode.Frame,
  pattern: PrimitiveQrCode.Pattern,
  overlay: PrimitiveQrCode.Overlay,
  downloadTrigger: PrimitiveQrCode.DownloadTrigger,
};

export type QrCodeRuntimePartProps = NativeHtmlAliases &
  Partial<DownloadTriggerProps> & {
    unstyled?: boolean | undefined;
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?:
      | PolymorphicProps<'svg'>['asChild']
      | PolymorphicProps<'path'>['asChild']
      | PolymorphicProps<'div'>['asChild']
      | PolymorphicProps<'button'>['asChild'];
    children?: JSX.Element | undefined;
  };

/** Forward one native QR part while the primitive owns SVG encoding and downloads. */
export function renderQrCodePart(
  slot: QrCodePartSlot,
  props: QrCodeRuntimePartProps,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const appearance = useQrCodeAppearance();
  const part = partComponents[slot];
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? partTags[slot];
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive's native props and events reactive. */
    () => native,
    /** Convert html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve the selected native part's ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`qr-code__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress authored presentation without hiding the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Supply the frame's default path only when no child owns it. */
      get children() {
        const children = local.children;
        return children !== undefined || local.asChild ? children : defaultChildren?.();
      },
      /** Preserve caller-owned or selected native parts. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The primitive's four parts own distinct native tags but share this forwarding contract.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
