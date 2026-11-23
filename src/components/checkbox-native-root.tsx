import { createMemo, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { checkmarkAttributes } from './checkmark-attributes';
import { readCheckmarkPalette } from './checkmark-choices';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { readCheckboxChoices } from './checkbox-choices';
import type { CheckboxPresentation } from './checkbox-presentation';
import type { CheckboxRuntimeRootProps } from './checkbox-root-props';
import { composeRecipeClassNames } from '../styled-system/recipe-class';

export const checkboxNativeRootKeys = [
  'size',
  'variant',
  'colorPalette',
  'unstyled',
  'class',
  'className',
  'ref',
  'as',
  'asChild',
] as const;

type RootLocal = Pick<CheckboxRuntimeRootProps, (typeof checkboxNativeRootKeys)[number]>;

/** Bind finite CSS selections and the primitive polymorphism to one Checkbox root. */
export function useCheckboxNativeRoot(
  local: RootLocal,
  native: object,
  content: { readonly children?: JSX.Element },
): { attributes: Accessor<object>; presentation: Accessor<CheckboxPresentation> } {
  const choices = createMemo(
    /** Validate scalar or ordinary responsive appearance selections. */
    () => readCheckboxChoices(local.size, local.variant),
  );
  const presentation = createMemo(
    /** Keep descendant parts on the nearest root's live CSS choices. */
    (): CheckboxPresentation => ({ choices: choices(), unstyled: Boolean(local.unstyled) }),
  );

  /** Select a native root tag while preserving the primitive's behavior props. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'label';
  }

  /** Forward the selected root element to its consumer ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const attributes = createMemo(
    /** Follow native props, palette, classes, and finite CSS selectors. */
    () => ({
      ...native,
      ...checkmarkAttributes(choices()),
      'data-lui-color-palette': readCheckmarkPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('checkbox', undefined, local.class, local.className),
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
      /** Resolve children only after the primitive establishes the Checkbox machine. */
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
