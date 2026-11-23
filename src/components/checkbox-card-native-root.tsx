import { createMemo, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { checkboxCardAttributes } from './checkbox-card-attributes';
import { readCheckboxCardChoices } from './checkbox-card-choices';
import type { CheckboxCardPresentation } from './checkbox-card-presentation';
import type { CheckboxCardRuntimeRootProps } from './checkbox-card-root-props';
import { readCheckmarkPalette } from './checkmark-choices';

export const checkboxCardNativeRootKeys = [
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
] as const;

type CardRootLocal = Pick<
  CheckboxCardRuntimeRootProps,
  (typeof checkboxCardNativeRootKeys)[number]
>;

/** Bind Card appearance attributes while preserving the primitive's native root. */
export function useCheckboxCardNativeRoot(
  local: CardRootLocal,
  native: object,
  content: { readonly children?: JSX.Element },
): { attributes: Accessor<object>; presentation: Accessor<CheckboxCardPresentation> } {
  const choices = createMemo(
    /** Validate the current finite and responsive Card selections. */
    () => readCheckboxCardChoices(local),
  );
  const presentation = createMemo(
    /** Keep descendant Card parts on their nearest root's live choices. */
    (): CheckboxCardPresentation => ({ choices: choices(), unstyled: Boolean(local.unstyled) }),
  );

  /** Select a native root tag while preserving the primitive's behavior props. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'label';
  }

  /** Forward the Card root element to the consumer ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const attributes = createMemo(
    /** Follow native props, palette, classes, and finite Card selectors. */
    () => ({
      ...native,
      ...checkboxCardAttributes(choices()),
      'data-lui-color-palette': readCheckmarkPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('checkbox-card', undefined, local.class, local.className),
      ref: local.ref,
      asChild: local.asChild
        ? primitiveChildWithRef(local.asChild, readRef)
        : local.as
          ? primitiveAsChild<'label'>(readTag, readRef)
          : undefined,
    }),
  );
  const attributesWithChildren = mergeProps(
    /** Forward native and presentation attributes without freezing props. */
    () => attributes(),
    {
      /** Resolve children after the primitive establishes the Checkbox machine. */
      get children() {
        return content.children;
      },
    },
  );

  /** Return the stable primitive props proxy with live native children. */
  function readAttributes(): object {
    return attributesWithChildren;
  }

  return { attributes: readAttributes, presentation };
}
