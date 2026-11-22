import { splitProps } from '../primitives/utils/split-props';
import { RadioGroup as PrimitiveRadioGroup } from '../primitives/components/radio-group';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { readRadioGroupChoices } from './radio-group-choices';
import {
  RadioGroupPresentationProvider,
  type RadioGroupPresentation,
} from './radio-group-presentation';
import {
  useRadioGroupRootProps,
  useRadioGroupRootProviderProps,
  type RadioGroupRootProps,
  type RadioGroupRootProviderProps,
  type RadioGroupRuntimeRootProps,
  type RadioGroupRuntimeProviderProps,
} from './radio-group-props';
import { radiomarkAttributes } from './radiomark-attributes';
import { readRadiomarkPalette } from './radiomark-choices';

type RuntimeRootProps = RadioGroupRuntimeRootProps | RadioGroupRuntimeProviderProps;
type RootMode = 'root' | 'provider';

/** Bind finite Radio Group CSS hooks around either primitive root mode. */
function renderRadioGroupRoot(
  mode: RootMode,
  props: RuntimeRootProps,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = mode === 'root' ? PrimitiveRadioGroup.Root : PrimitiveRadioGroup.RootProvider;
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const choices = createMemo(
    /** Validate every changing size and treatment before binding selectors. */
    () => readRadioGroupChoices(local),
  );
  const presentation = createMemo(
    /** Keep descendant controls on the nearest root's live choices. */
    (): RadioGroupPresentation => ({ choices: choices(), unstyled: Boolean(local.unstyled) }),
  );

  /** Select the caller's native tag for the primitive's polymorphic root. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Forward the caller's ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive behavior props and native attributes reactive. */
    () => native,
    /** Expose every finite breakpoint to authored Group CSS. */
    () => radiomarkAttributes({ ...choices(), filled: { base: false } }),
    {
      /** Bind stable group and responsive selectors without inserted styles. */
      get class() {
        return composeRecipeClassNames(
          'radio-group__root',
          undefined,
          'leverui-radio-group',
          local.class,
          local.className,
        );
      },
      /** Keep the selected semantic palette on the root scope. */
      get 'data-leverui-color-palette'() {
        return readRadiomarkPalette(local.colorPalette);
      },
      /** Suppress authored presentation without changing selection. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Forward the ref to the primitive's native or caller-owned root. */
      get ref() {
        return local.ref;
      },
      /** Select the native tag or caller-rendered child. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
      /** Resolve children after the primitive creates its radio context. */
      get children() {
        return content.children;
      },
    },
  );

  return (
    <RadioGroupPresentationProvider value={presentation}>
      {/* The primitive's native root and provider have distinct machine prop types. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </RadioGroupPresentationProvider>
  );
}

/** Render a Radio Group with its own primitive machine. */
function RadioGroupRootImpl(props: RadioGroupRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRadioGroupRoot('root', useRadioGroupRootProps(instance), content);
}

/** Expose native, selected-element, and caller-rendered roots. */
export const RadioGroupRoot = RadioGroupRootImpl as <
  As extends keyof JSX.IntrinsicElements = 'div',
>(
  props: RadioGroupRootProps<As>,
) => JSX.Element;

/** Render a Radio Group around a caller-owned primitive machine. */
function RadioGroupRootProviderImpl(props: RadioGroupRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRadioGroupRoot('provider', useRadioGroupRootProviderProps(instance), content);
}

/** Require an external radio machine on provider roots. */
export const RadioGroupRootProvider = RadioGroupRootProviderImpl as <
  As extends keyof JSX.IntrinsicElements = 'div',
>(
  props: RadioGroupRootProviderProps<As>,
) => JSX.Element;
