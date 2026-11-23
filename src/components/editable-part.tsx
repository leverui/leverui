import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
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
import { useEditableContext } from './editable-machine';
import { editablePartComponents } from './editable-part-registry';
import { editablePartTags, type EditablePartSlot } from './editable-part-tags';
import type { EditablePartProps } from './editable-part-props';
import { useEditablePresentation } from './editable-presentation';
import type { EditableIntrinsicElement } from './editable-types';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: EditableIntrinsicElement | undefined;
  asChild?: NonNullable<PolymorphicProps<'div'>['asChild']> | undefined;
  children?: JSX.Element | undefined;
};

/** Attach a stable Editable part hook while preserving the primitive's behavior. */
function renderEditablePartImpl(slot: EditablePartSlot, props: unknown): JSX.Element {
  // The public signature correlates slot and native props; the registry fixes its primitive.
  const runtimeProps = props as RuntimePartProps;
  const part = editablePartComponents[slot] as Component<object>;
  const presentation = useEditablePresentation();
  const preview = slot === 'preview' ? useEditableContext() : undefined;
  const [local, rest] = splitProps(runtimeProps, [
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'children',
    ...nativeHtmlAliasNames,
  ]);
  /** Follow the native part tag selected by the caller. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? editablePartTags[slot];
  }

  /** Expose the callback ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive and native attributes without runtime styling. */
    () => rest,
    /** Convert Lever UI native aliases before the primitive renders the part. */
    () => nativeHtmlAttributes(local),
    {
      /** Retain callback refs on the default part tag. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook and consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `editable__${slot}`,
          slot === 'textarea' ? 'lui-editable__input' : undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored CSS under an unstyled root or part. */
      get 'data-unstyled'() {
        return presentation.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve caller content or Zag's live preview text. */
      get children() {
        return local.children === undefined ? preview?.().valueText : local.children;
      },
      /** Preserve a selected native tag or caller-owned child. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The registry fixes which primitive part receives these checked props.
  return createComponent(part, primitiveProps);
}

/** Expose a slot-specific public type at the primitive adapter boundary. */
export const renderEditablePart = renderEditablePartImpl as <
  Slot extends EditablePartSlot,
  As extends EditableIntrinsicElement = (typeof editablePartTags)[Slot],
>(
  slot: Slot,
  props: EditablePartProps<Slot, As>,
) => JSX.Element;
