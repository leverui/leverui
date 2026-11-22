import { splitProps } from '../primitives/utils/split-props';
import type {
  FieldsetErrorTextProps as PrimitiveErrorTextProps,
  FieldsetHelperTextProps as PrimitiveHelperTextProps,
  FieldsetLegendProps as PrimitiveLegendProps,
} from '../primitives/components/fieldset';
import type { HTMLPrimitiveProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type {
  FieldsetContentProps,
  FieldsetErrorTextProps,
  FieldsetHelperTextProps,
  FieldsetLegendProps,
} from './fieldset-props';
import { useFieldsetPresentation } from './fieldset-presentation';

type FieldsetPartProps =
  FieldsetLegendProps | FieldsetHelperTextProps | FieldsetErrorTextProps | FieldsetContentProps;
type FieldsetPartSlot = 'legend' | 'helperText' | 'errorText' | 'content';
const partTags = {
  legend: 'legend',
  helperText: 'span',
  errorText: 'span',
  content: 'div',
} as const satisfies Record<FieldsetPartSlot, keyof JSX.IntrinsicElements>;

/** Pair the primitive's associated legend with its public props. */
export function renderFieldsetPart(
  part: Component<PrimitiveLegendProps>,
  slot: 'legend',
  props: FieldsetLegendProps,
): JSX.Element;
/** Pair the primitive's helper text with its public props. */
export function renderFieldsetPart(
  part: Component<PrimitiveHelperTextProps>,
  slot: 'helperText',
  props: FieldsetHelperTextProps,
): JSX.Element;
/** Pair the primitive's conditional error text with its public props. */
export function renderFieldsetPart(
  part: Component<PrimitiveErrorTextProps>,
  slot: 'errorText',
  props: FieldsetErrorTextProps,
): JSX.Element;
/** Render the native content part without changing Fieldset state. */
export function renderFieldsetPart(
  part: Component<HTMLPrimitiveProps<'div'>>,
  slot: 'content',
  props: FieldsetContentProps,
): JSX.Element;

/** Attach one authored CSS hook while preserving the primitive context behavior. */
export function renderFieldsetPart<PrimitiveProps extends object>(
  part: Component<PrimitiveProps>,
  slot: FieldsetPartSlot,
  props: FieldsetPartProps,
): JSX.Element {
  const presentation = useFieldsetPresentation();
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

  /** Read the consumer ref at the primitive child boundary. */
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
      /** Compose the stable part hook and consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `fieldset__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored appearance under an unstyled root or part. */
      get 'data-unstyled'() {
        return presentation.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Keep caller content inside the native part. */
      get children() {
        return local.children;
      },
      /** Preserve a caller-owned child or selected native tag. */
      get asChild() {
        const child = local.asChild;
        return child ? primitiveChildWithRef(child, readRef) : primitiveAsChild(readTag, readRef);
      },
    },
  );

  // Overloads pair each primitive part with its public props at this boundary.
  return createComponent(part, primitiveProps as PrimitiveProps);
}
