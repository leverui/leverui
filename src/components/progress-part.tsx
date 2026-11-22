import { splitProps } from '../primitives/utils/split-props';
import { Progress as PrimitiveProgress } from '../primitives/components/progress';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useProgressAppearance } from './progress-appearance';
import type { ClassValue } from '../utils/class-value';

type ProgressPartSlot = 'label' | 'track' | 'range' | 'valueText';
const partTags = {
  label: 'span',
  track: 'div',
  range: 'div',
  valueText: 'span',
} as const satisfies Record<ProgressPartSlot, PrimitiveNativeTag>;
const partComponents = {
  label: PrimitiveProgress.Label,
  track: PrimitiveProgress.Track,
  range: PrimitiveProgress.Range,
  valueText: PrimitiveProgress.ValueText,
};

export type ProgressRuntimePartProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | PolymorphicProps<'span'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

/** Forward one native Progress part while the primitive owns range state and ARIA. */
export function renderProgressPart(
  slot: ProgressPartSlot,
  props: ProgressRuntimePartProps,
): JSX.Element {
  const appearance = useProgressAppearance();
  const part = partComponents[slot];
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? partTags[slot];
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep native attributes and events reactive. */
    () => native,
    {
      /** Forward the selected part ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `progress__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation without hiding the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Let the primitive supply its default value text when children are absent. */
      get children() {
        return local.children;
      },
      /** Preserve caller-owned or selected native parts. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  // The registry pairs each slot with its primitive component.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
