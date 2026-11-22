import { splitProps } from '../primitives/utils/split-props';
import { NumberInput as PrimitiveNumberInput } from '../primitives/components/number-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useNumberInputAppearance } from './number-input-appearance';
import { useNumberInputContext } from './number-input-machine';
import type { NumberInputPartProps } from './number-input-part-props';
import { numberInputPartTags, type NumberInputPartSlot } from './number-input-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: unknown | undefined;
  readOnly?: boolean | undefined;
  children?: JSX.Element | undefined;
};

const numberInputPartComponents = {
  control: PrimitiveNumberInput.Control,
  decrementTrigger: PrimitiveNumberInput.DecrementTrigger,
  hiddenInput: PrimitiveNumberInput.HiddenInput,
  incrementTrigger: PrimitiveNumberInput.IncrementTrigger,
  input: PrimitiveNumberInput.Input,
  label: PrimitiveNumberInput.Label,
  scrubber: PrimitiveNumberInput.Scrubber,
  valueText: PrimitiveNumberInput.ValueText,
} as const;

/** Forward a native numeric part while authored CSS owns its presentation. */
function renderNumberInputPartImpl(
  slot: NumberInputPartSlot,
  props: RuntimePartProps,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const part = numberInputPartComponents[slot];
  const appearance = useNumberInputAppearance();
  const machine = slot === 'input' ? useNumberInputContext() : undefined;
  const [local, native] = splitProps(props, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
  ]);

  /** Follow the native tag selected by the caller. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? numberInputPartTags[slot];
  }

  /** Expose the callback ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native and machine attributes without extracting CSS props. */
    () => native,
    /** Give the numeric field the shared Input size and variant attributes. */
    () => (slot === 'input' ? appearance.attributes() : {}),
    {
      /** Retain the ref on the default native element. */
      get ref() {
        return local.ref;
      },
      /** Keep both the numeric part hook and shared Input hook stable. */
      get class() {
        return composeRecipeClassNames(
          `number-input__${slot}`,
          undefined,
          slot === 'input' ? 'leverui-input' : undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress default CSS for an unstyled root or part. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Supply default controls and glyphs when children are absent. */
      get children() {
        const children = local.children;
        return children === undefined ? defaultChildren?.() : children;
      },
      /** Preserve caller-owned or selected native elements. */
      get asChild() {
        if (typeof local.asChild === 'function') {
          // The primitive's child callback is type-erased only at this mixed-slot boundary.
          return primitiveChildWithRef(
            local.asChild as Parameters<typeof primitiveChildWithRef>[0],
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    slot === 'input'
      ? {
          /** Follow the machine's changing native read-only state. */
          get readonly() {
            return props.readOnly ?? machine?.().getInputProps().readonly;
          },
        }
      : {},
  );

  // The primitive's union of polymorphic part signatures needs one call-site cast.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Keep public slot props checked against the shared primitive implementation. */
export const renderNumberInputPart: <
  Slot extends NumberInputPartSlot,
  As extends PrimitiveNativeTag = (typeof numberInputPartTags)[Slot],
>(
  slot: Slot,
  props: NumberInputPartProps<Slot, As>,
  defaultChildren?: () => JSX.Element,
) => JSX.Element = renderNumberInputPartImpl;
