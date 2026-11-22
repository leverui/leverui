import { splitProps } from '../primitives/utils/split-props';
import { Steps as PrimitiveSteps } from '../primitives/components/steps';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { stepsAppearanceAttributes, type StepsAppearance } from './steps-appearance';
import type { UseStepsProps, UseStepsReturn } from './steps-machine';
import {
  useStepsRootProps,
  useStepsRootProviderProps,
  type StepsRootProps,
  type StepsRootProviderProps,
} from './steps-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeLocalProps = StepsAppearance & {
  class?: ClassValue | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};
type RuntimeRootProps = RuntimeLocalProps & UseStepsProps;
type RuntimeProviderProps = RuntimeLocalProps & { value: UseStepsReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind either Steps machine root to stable authored CSS selectors. */
function renderStepsRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveSteps.Root : PrimitiveSteps.RootProvider;
  const [local, native] = splitProps(input.props, [
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow the caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's current root ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve native attributes and machine options reactively. */
    () => native,
    /** Convert supported native aliases at the rendered root. */
    () => nativeHtmlAttributes(local),
    /** Select finite appearance rules at supported breakpoints. */
    () => stepsAppearanceAttributes(local.size, local.variant),
    {
      /** Forward the native root ref. */
      get ref() {
        return local.ref;
      },
      /** Expose a stable root hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('steps__root', undefined, local.class, local.className);
      },
      /** Bind semantic palette tokens when requested. */
      get 'data-leverui-color-palette'() {
        return local.colorPalette;
      },
      /** Suppress default presentation while retaining machine behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep public parts inside the nearest primitive machine context. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected root elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Create a Steps machine with native attributes and authored CSS hooks. */
function StepsRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderStepsRoot({ mode: 'root', props: useStepsRootProps(instance) }, content);
}

/** Expose the checked native root contract for a selected element. */
export const StepsRoot = StepsRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: StepsRootProps<As>,
) => JSX.Element;

/** Render Steps around a caller-owned reactive machine accessor. */
function StepsRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderStepsRoot({ mode: 'provider', props: useStepsRootProviderProps(instance) }, content);
}

/** Require a caller-owned machine on provider roots. */
export const StepsRootProvider = StepsRootProviderImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: StepsRootProviderProps<As>,
) => JSX.Element;
