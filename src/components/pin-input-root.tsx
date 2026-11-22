import { splitProps } from '../primitives/utils/split-props';
import { PinInput as PrimitivePinInput } from '../primitives/components/pin-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { inputAppearanceAttributes } from './input-appearance-attributes';
import { pinInputAttachedAttributes } from './pin-input-appearance';
import { PinInputPresentationProvider } from './pin-input-presentation';
import {
  usePinInputRootProps,
  usePinInputRootProviderProps,
  type PinInputRootProps,
  type PinInputRootProviderProps,
} from './pin-input-props';
import type {
  PinInputRuntimeProviderProps,
  PinInputRuntimeRootProps,
} from './pin-input-runtime-props';

type RootInput =
  | { mode: 'root'; props: PinInputRuntimeRootProps }
  | { mode: 'provider'; props: PinInputRuntimeProviderProps };

/** Bind either primitive Pin Input root to authored CSS appearance attributes. */
function renderPinInputRoot(input: RootInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitivePinInput.Root : PrimitivePinInput.RootProvider;
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    [
      'size',
      'variant',
      'attached',
      'colorPalette',
      'unstyled',
      'class',
      'className',
      'ref',
      'as',
      'asChild',
      ...nativeHtmlAliasNames,
    ],
  );
  const presentation = {
    /** Follow inherited or local size selections without freezing Solid props. */
    size: () => local.size,
    /** Follow inherited or local Input surface treatments. */
    variant: () => local.variant,
    /** Suppress every part's default presentation when the root is unstyled. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's current ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve native attributes and the primitive machine options, including mask. */
    () => native,
    /** Convert supported native aliases before the primitive renders the root. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite size and variant selections on the public root. */
    () => inputAppearanceAttributes(local.size, local.variant, 'Pin Input'),
    /** Reflect attached choices at every supported breakpoint. */
    () => pinInputAttachedAttributes(local.attached),
    {
      /** Forward the caller's native root ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('pin-input__root', undefined, local.class, local.className);
      },
      /** Bind semantic palette variables for all visible fields. */
      get 'data-leverui-color-palette'() {
        return local.colorPalette;
      },
      /** Suppress authored root and part presentation without changing the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep public parts inside the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Keep selected tags and caller-owned children under the primitive's observer. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <PinInputPresentationProvider value={presentation}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </PinInputPresentationProvider>
  );
}

/** Render a Pin Input with its own primitive and Zag machine. */
function PinInputRootImpl(props: PinInputRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = usePinInputRootProps(instance);
  const rootProps = mergeProps(merged, content);
  return renderPinInputRoot({ mode: 'root', props: rootProps });
}

/** Expose native root props with finite authored appearance choices. */
export const PinInputRoot = PinInputRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: PinInputRootProps<As>,
) => JSX.Element;

/** Render a Pin Input around a caller-owned primitive machine. */
function PinInputRootProviderImpl(props: PinInputRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = usePinInputRootProviderProps(instance);
  const providerProps = mergeProps(merged, content);
  return renderPinInputRoot({ mode: 'provider', props: providerProps });
}

/** Require an external machine on provider roots. */
export const PinInputRootProvider = PinInputRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: PinInputRootProviderProps<As>,
) => JSX.Element;
