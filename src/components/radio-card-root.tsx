import { splitProps } from '../primitives/utils/split-props';
import { RadioGroup as PrimitiveRadioGroup } from '../primitives/components/radio-group';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { radioCardAttributes } from './radio-card-attributes';
import { readRadioCardChoices } from './radio-card-choices';
import {
  RadioCardPresentationProvider,
  type RadioCardPresentation,
} from './radio-card-presentation';
import {
  useRadioCardRootProps,
  useRadioCardRootProviderProps,
  type RadioCardRootProps,
  type RadioCardRootProviderProps,
  type RadioCardRuntimeRootProps,
  type RadioCardRuntimeProviderProps,
} from './radio-card-props';
import { readRadiomarkPalette } from './radiomark-choices';

type RuntimeRootProps = RadioCardRuntimeRootProps | RadioCardRuntimeProviderProps;
type RootMode = 'root' | 'provider';

/** Bind finite Card CSS hooks around either primitive radio root mode. */
function renderRadioCardRoot(
  mode: RootMode,
  props: RuntimeRootProps,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = mode === 'root' ? PrimitiveRadioGroup.Root : PrimitiveRadioGroup.RootProvider;
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'align',
    'justify',
    'orientation',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const choices = createMemo(
    /** Validate current finite presentation props before binding selectors. */
    () => readRadioCardChoices(local),
  );
  const presentation = createMemo(
    /** Keep descendant parts on the nearest root's live Card choices. */
    (): RadioCardPresentation => ({ choices: choices(), unstyled: Boolean(local.unstyled) }),
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
    mode === 'root'
      ? {
          /** Give the machine-owning primitive root its keyboard orientation. */
          get orientation() {
            return local.orientation;
          },
        }
      : {},
    /** Expose each finite breakpoint to authored Card CSS. */
    () => radioCardAttributes(choices()),
    {
      /** Bind the stable root class without inserting a stylesheet. */
      get class() {
        return composeRecipeClassNames(
          'radio-card__root',
          undefined,
          'leverui-radio-card',
          local.class,
          local.className,
        );
      },
      /** Scope the selected semantic palette to Card descendants. */
      get 'data-leverui-color-palette'() {
        return readRadiomarkPalette(local.colorPalette);
      },
      /** Suppress authored presentation without changing selection. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Forward a caller ref to the native or caller-owned root. */
      get ref() {
        return local.ref;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
      /** Resolve children after the primitive establishes its radio context. */
      get children() {
        return content.children;
      },
    },
  );

  return (
    <RadioCardPresentationProvider value={presentation}>
      {/* The primitive's native root and provider have distinct machine prop types. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </RadioCardPresentationProvider>
  );
}

/** Render a Card with its own primitive radio-group machine. */
function RadioCardRootImpl(props: RadioCardRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRadioCardRoot('root', useRadioCardRootProps(instance), content);
}

/** Expose native, selected-element, and caller-rendered Card roots. */
export const RadioCardRoot = RadioCardRootImpl as <As extends keyof JSX.IntrinsicElements = 'div'>(
  props: RadioCardRootProps<As>,
) => JSX.Element;

/** Render a Card around a caller-owned primitive radio-group machine. */
function RadioCardRootProviderImpl(props: RadioCardRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRadioCardRoot('provider', useRadioCardRootProviderProps(instance), content);
}

/** Require an external radio machine on provider roots. */
export const RadioCardRootProvider = RadioCardRootProviderImpl as <
  As extends keyof JSX.IntrinsicElements = 'div',
>(
  props: RadioCardRootProviderProps<As>,
) => JSX.Element;
