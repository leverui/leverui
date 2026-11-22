import { splitProps } from '../primitives/utils/split-props';
import type {
  FieldErrorTextProps as PrimitiveErrorTextProps,
  FieldHelperTextProps as PrimitiveHelperTextProps,
  FieldLabelProps as PrimitiveLabelProps,
  FieldRequiredIndicatorProps as PrimitiveRequiredIndicatorProps,
} from '../primitives/components/field';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { useFieldPresentation } from './field-presentation';
import type {
  FieldErrorTextProps,
  FieldHelperTextProps,
  FieldLabelProps,
  FieldRequiredIndicatorProps,
} from './field-props';

type FieldPartProps =
  FieldLabelProps | FieldHelperTextProps | FieldErrorTextProps | FieldRequiredIndicatorProps;
type FieldPartSlot = 'label' | 'helperText' | 'errorText' | 'requiredIndicator';
const partTags = {
  label: 'label',
  helperText: 'span',
  errorText: 'span',
  requiredIndicator: 'span',
} as const satisfies Record<FieldPartSlot, keyof JSX.IntrinsicElements>;

/** Bind the primitive's associated Field label to its public props. */
export function renderFieldPart(
  part: Component<PrimitiveLabelProps>,
  slot: 'label',
  props: FieldLabelProps,
): JSX.Element;
/** Bind the primitive's descriptive helper text to its public props. */
export function renderFieldPart(
  part: Component<PrimitiveHelperTextProps>,
  slot: 'helperText',
  props: FieldHelperTextProps,
): JSX.Element;
/** Bind the primitive's conditional validation message to its public props. */
export function renderFieldPart(
  part: Component<PrimitiveErrorTextProps>,
  slot: 'errorText',
  props: FieldErrorTextProps,
): JSX.Element;
/** Bind the primitive's conditional required marker to its public props. */
export function renderFieldPart(
  part: Component<PrimitiveRequiredIndicatorProps>,
  slot: 'requiredIndicator',
  props: FieldRequiredIndicatorProps,
): JSX.Element;

/** Attach one authored CSS hook without losing the primitive's field context behavior. */
export function renderFieldPart<PrimitiveProps extends object>(
  part: Component<PrimitiveProps>,
  slot: FieldPartSlot,
  props: FieldPartProps,
): JSX.Element {
  const presentation = useFieldPresentation();
  const [local, rest] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
    ...nativeHtmlAliasNames,
  ]);

  /** Read the latest consumer ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  /** Follow the native tag selected by the caller. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? partTags[slot];
  }

  const primitiveProps = mergeProps(
    /** Forward native and primitive attributes without runtime styling. */
    () => rest,
    /** Convert native aliases before the primitive renders the part. */
    () => nativeHtmlAttributes(local),
    {
      /** Compose the stable public part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`field__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress root or part presentation without changing the primitive state. */
      get 'data-unstyled'() {
        return presentation.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Keep caller content inside the primitive's conditional part. */
      get children() {
        return local.children;
      },
      /** Preserve the caller's native element or owned child. */
      get asChild() {
        const child = local.asChild;
        return child ? primitiveChildWithRef(child, readRef) : primitiveAsChild(readTag, readRef);
      },
    },
  );

  // The overloads bind each primitive part to its matching public props.
  return createComponent(part, primitiveProps as PrimitiveProps);
}
