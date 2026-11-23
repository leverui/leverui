import { splitProps } from '../primitives/utils/split-props';
import type {
  DialogBackdropProps as PrimitiveBackdropProps,
  DialogCloseTriggerProps as PrimitiveCloseTriggerProps,
  DialogContentProps as PrimitiveContentProps,
  DialogDescriptionProps as PrimitiveDescriptionProps,
  DialogPositionerProps as PrimitivePositionerProps,
  DialogTitleProps as PrimitiveTitleProps,
  DialogTriggerProps as PrimitiveTriggerProps,
} from '../primitives/components/dialog';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PolymorphicProps } from '../primitives/components/factory';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { ComponentIntrinsicElement } from './component-element-props';
import type { DialogPartInput, DialogPartPropsBySlot } from './dialog-part-props';
import { useDialogAuthoredStyleState } from './dialog-authored-style-state';
import { useInitialAnimationSuppressed } from './overlay-initial-animation';

type DialogPartSlot = keyof DialogPartPropsBySlot;

/** Match each public Dialog slot and native element to its primitive part. */
export function renderDialogPart(
  primitivePart: Component<PrimitiveTriggerProps>,
  slot: 'trigger',
  props: DialogPartPropsBySlot['trigger'],
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitiveBackdropProps>,
  slot: 'backdrop',
  props: DialogPartPropsBySlot['backdrop'],
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitivePositionerProps>,
  slot: 'positioner',
  props: DialogPartPropsBySlot['positioner'],
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitiveContentProps>,
  slot: 'content',
  props: DialogPartPropsBySlot['content'],
  renderChild: PrimitiveContentProps['asChild'],
  childRef: () => unknown,
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitiveTitleProps>,
  slot: 'title',
  props: DialogPartPropsBySlot['title'],
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitiveDescriptionProps>,
  slot: 'description',
  props: DialogPartPropsBySlot['description'],
  renderChild: PrimitiveDescriptionProps['asChild'],
  childRef: () => unknown,
): JSX.Element;
export function renderDialogPart(
  primitivePart: Component<PrimitiveCloseTriggerProps>,
  slot: 'closeTrigger',
  props: DialogPartPropsBySlot['closeTrigger'],
): JSX.Element;

/** Render the typed primitive part with portal-safe CSS hooks and native props. */
export function renderDialogPart<PrimitiveProps extends object>(
  primitivePart: Component<PrimitiveProps>,
  slot: DialogPartSlot,
  props: DialogPartInput,
  renderChild?: PrimitiveContentProps['asChild'],
  childRef?: () => unknown,
): JSX.Element {
  const authored = useDialogAuthoredStyleState();
  const suppressInitialAnimation = useInitialAnimationSuppressed();
  const [local, rest] = splitProps(props, [
    'class',
    'className',
    'children',
    'unstyled',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  /** Resolve the selected native part without freezing caller props. */
  function readTag(): ComponentIntrinsicElement {
    const selected = local.as;
    if (!selected) throw new Error('The selected Dialog part element is missing.');
    return selected;
  }

  /** Preserve the caller ref on a primitive child renderer. */
  function readRef(): unknown {
    return childRef ? childRef() : local.ref;
  }
  const primitiveProps = mergeProps(
    /** Forward reactive native attributes to the primitive. */
    () => rest,
    /** Translate public native aliases before the primitive reaches the DOM. */
    () => nativeHtmlAttributes(local),
    /** Keep finite appearance attributes on the native portal part. */
    () => authored.partAttributes(local.unstyled),
    {
      /** Suppress only the first authored entrance animation. */
      get 'data-lui-private-skip-initial-animation'() {
        return authored.usesAuthoredCss() &&
          suppressInitialAnimation() &&
          (slot === 'content' || slot === 'backdrop')
          ? ''
          : undefined;
      },
      /** Keep the public part hook and consumer classes on the native part. */
      get class() {
        return composeRecipeClassNames(
          `${authored.family}__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Use a primitive child renderer for a semantic native element when supplied. */
      get asChild() {
        if (local.asChild) {
          // The primitive's slot-specific callback signatures share the same DOM runtime shape.
          return primitiveChildWithRef(
            local.asChild as NonNullable<PolymorphicProps<'div'>['asChild']>,
            readRef,
          );
        }
        if (local.as) return primitiveAsChild(readTag, readRef);
        return renderChild;
      },
      /** Forward the native part to its consumer. */
      get ref() {
        return local.ref;
      },
      /** Keep children lazy under the primitive's context and presence. */
      get children() {
        return local.children;
      },
    },
  );

  // Solid cannot infer that these composed native props match the supplied primitive part.
  return createComponent(primitivePart as Component<typeof primitiveProps>, primitiveProps);
}
