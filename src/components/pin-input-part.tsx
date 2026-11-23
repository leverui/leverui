import { splitProps } from '../primitives/utils/split-props';
import { PinInput as PrimitivePinInput } from '../primitives/components/pin-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { inputAppearanceAttributes } from './input-appearance-attributes';
import type { PinInputPartProps } from './pin-input-part-props';
import { pinInputPartTags, type PinInputPartSlot } from './pin-input-part-registry';
import { usePinInputContext } from './pin-input-machine';
import { usePinInputPresentation } from './pin-input-presentation';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: unknown | undefined;
  index?: number | undefined;
  readOnly?: boolean | undefined;
  children?: JSX.Element | undefined;
};

const pinInputPartComponents = {
  control: PrimitivePinInput.Control,
  input: PrimitivePinInput.Input,
  label: PrimitivePinInput.Label,
} as const;

/** Keep an indexed field's read-only state aligned with Zag and caller props. */
function useInputReadOnlyProps(slot: PinInputPartSlot, props: RuntimePartProps) {
  if (slot !== 'input') return {};
  const machine = usePinInputContext();
  return {
    /** Forward a native override or the current machine state. */
    get readonly() {
      if (props.readOnly !== undefined) return props.readOnly;
      if (typeof props.index !== 'number') {
        throw new Error('PinInput.Input requires a numeric index.');
      }
      return machine().getInputProps({ index: props.index }).readonly;
    },
  };
}

/** Bind one primitive Pin Input part to native props and authored CSS hooks. */
function renderPinInputPartImpl(slot: PinInputPartSlot, props: RuntimePartProps): JSX.Element {
  const part = pinInputPartComponents[slot];
  const presentation = usePinInputPresentation();
  const readOnlyProps = useInputReadOnlyProps(slot, props);
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? pinInputPartTags[slot];
  }

  /** Forward the current callback ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive behavior and native attributes without style extraction. */
    () => native,
    /** Convert public native aliases at the rendered part. */
    () => nativeHtmlAttributes(local),
    /** Reuse the Input stylesheet for each visible indexed field. */
    () =>
      slot === 'input'
        ? inputAppearanceAttributes(presentation.size(), presentation.variant(), 'Pin Input')
        : {},
    readOnlyProps,
    {
      /** Keep default and selected-tag refs attached to the native element. */
      get ref() {
        return local.ref;
      },
      /** Expose the stable part hook and the shared Input presentation hook. */
      get class() {
        return composeRecipeClassNames(
          `pin-input__${slot}`,
          undefined,
          slot === 'input' ? 'lui-input' : undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress this part or the root's authored presentation. */
      get 'data-unstyled'() {
        return presentation.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve consumer content inside the matching primitive part. */
      get children() {
        return content.children;
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
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Keep indexed input props checked against the shared primitive implementation. */
export const renderPinInputPart: <
  Slot extends PinInputPartSlot,
  As extends PrimitiveNativeTag = (typeof pinInputPartTags)[Slot],
>(
  slot: Slot,
  props: PinInputPartProps<Slot, As>,
) => JSX.Element = renderPinInputPartImpl;
