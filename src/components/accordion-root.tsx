import { splitProps } from '../primitives/utils/split-props';
import { Accordion as PrimitiveAccordion } from '../primitives/components/accordion';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  AccordionAppearanceProvider,
  accordionAppearanceAttributes,
  type AccordionAppearanceState,
} from './accordion-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  useAccordionRootProps,
  useAccordionRootProviderProps,
  type AccordionRootProps,
  type AccordionRootProviderProps,
} from './accordion-props';
import type {
  AccordionRuntimeProviderProps,
  AccordionRuntimeRootProps,
} from './accordion-runtime-props';

const rootParts = {
  root: PrimitiveAccordion.Root,
  provider: PrimitiveAccordion.RootProvider,
} as const;
type RootMode = keyof typeof rootParts;
type RuntimeRoot = AccordionRuntimeRootProps | AccordionRuntimeProviderProps;

/** Bind finite appearance and native attributes to one primitive Accordion root. */
function renderAccordionRoot(
  mode: RootMode,
  props: RuntimeRoot,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part = rootParts[mode];
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
  const attributes = createMemo(
    /** Keep responsive size, treatment, and palette selectors live. */
    () => accordionAppearanceAttributes(local),
  );
  const appearance: AccordionAppearanceState = {
    /** Suppress part presentation while retaining the primitive behavior. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Expose the caller's ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native and machine props without style-object inputs. */
    () => native,
    /** Reflect authored appearance choices on the root. */
    () => attributes(),
    {
      /** Preserve callback refs on the default root. */
      get ref() {
        return local.ref;
      },
      /** Keep the public root hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('accordion__root', undefined, local.class, local.className);
      },
      /** Construct parts inside the primitive's machine and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned and selected native root elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <AccordionAppearanceProvider value={appearance}>
      {/* The primitive's two root signatures meet at this native adapter. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </AccordionAppearanceProvider>
  );
}

/** Render an Accordion with its own primitive selection machine. */
function AccordionRootImpl(props: AccordionRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderAccordionRoot('root', useAccordionRootProps(instance), content);
}

/** Expose a typed Accordion root with native element selection. */
export const AccordionRoot = AccordionRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: AccordionRootProps<As>,
) => JSX.Element;

/** Render an Accordion using a caller-owned primitive machine. */
function AccordionRootProviderImpl(props: AccordionRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderAccordionRoot('provider', useAccordionRootProviderProps(instance), content);
}

/** Require the caller's Accordion machine accessor. */
export const AccordionRootProvider = AccordionRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: AccordionRootProviderProps<As>,
) => JSX.Element;
