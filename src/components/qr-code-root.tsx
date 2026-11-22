import { splitProps } from '../primitives/utils/split-props';
import { QrCode as PrimitiveQrCode } from '../primitives/components/qr-code';
import type { PolymorphicProps } from '../primitives/components/factory';
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
import { QrCodeAppearanceProvider, type QrCodeAppearanceState } from './qr-code-appearance';
import { qrCodeAttributes } from './qr-code-attributes';
import type { QrCodeAppearance } from './qr-code-choices';
import {
  useQrCodeProps,
  useQrCodeRootProviderProps,
  type QrCodeRootProps,
  type QrCodeRootProviderProps,
} from './qr-code-props';
import type { UseQrCodeProps, UseQrCodeReturn } from './qr-code-types';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = UseQrCodeProps &
  QrCodeAppearance &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeProviderProps = Omit<RuntimeRootProps, keyof UseQrCodeProps | 'value'> & {
  value: UseQrCodeReturn;
};
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind authored appearance to either primitive QR machine root. */
function renderQrCodeRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveQrCode.Root : PrimitiveQrCode.RootProvider;
  const [local, native] = splitProps(input.props, [
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: QrCodeAppearanceState = {
    /** Follow the root's current unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine options and native attributes. */
    () => native,
    /** Convert html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite CSS selectors without inserted styles. */
    () => qrCodeAttributes(local),
    {
      /** Preserve the selected native element's ref. */
      get ref() {
        return local.ref;
      },
      /** Combine stable part hooks with consumer classes. */
      get class() {
        return composeRecipeClassNames('qr-code__root', undefined, local.class, local.className);
      },
      /** Keep parts beneath the active primitive machine. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected native roots. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <QrCodeAppearanceProvider value={appearance}>
      {/* The primitive's Root and RootProvider accept this shared native prop record. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </QrCodeAppearanceProvider>
  );
}

/** Render a QR code with its own primitive and Zag machine. */
function QrCodeRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderQrCodeRoot({ mode: 'root', props: useQrCodeProps(instance) }, content);
}

/** Expose a typed QR root with caller-owned element selection. */
export const QrCodeRoot = QrCodeRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: QrCodeRootProps<As>,
) => JSX.Element;

/** Render a QR code driven by a caller-owned primitive machine accessor. */
function QrCodeRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderQrCodeRoot(
    { mode: 'provider', props: useQrCodeRootProviderProps(instance) },
    content,
  );
}

/** Require an external QR machine accessor. */
export const QrCodeRootProvider = QrCodeRootProviderImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: QrCodeRootProviderProps<As>,
) => JSX.Element;
