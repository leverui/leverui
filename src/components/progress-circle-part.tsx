import { splitProps } from '../primitives/utils/split-props';
import { Progress as PrimitiveProgress } from '../primitives/components/progress';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useProgressCircleAppearance } from './progress-circle-appearance';
import type { ClassValue } from '../utils/class-value';

type CirclePartSlot = 'label' | 'circle' | 'circleTrack' | 'circleRange' | 'valueText';
const partTags = {
  label: 'span',
  circle: 'svg',
  circleTrack: 'circle',
  circleRange: 'circle',
  valueText: 'span',
} as const satisfies Record<CirclePartSlot, PrimitiveNativeTag>;
const partComponents = {
  label: PrimitiveProgress.Label,
  circle: PrimitiveProgress.Circle,
  circleTrack: PrimitiveProgress.CircleTrack,
  circleRange: PrimitiveProgress.CircleRange,
  valueText: PrimitiveProgress.ValueText,
};

export type CircleRuntimePartProps = {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  strokeLinecap?: string | undefined;
  'stroke-linecap'?: string | undefined;
  asChild?:
    | PolymorphicProps<'span'>['asChild']
    | PolymorphicProps<'svg'>['asChild']
    | PolymorphicProps<'circle'>['asChild'];
  children?: JSX.Element | undefined;
};

/** Forward one native Circle part while the primitive owns SVG geometry and ARIA. */
export function renderProgressCirclePart(
  slot: CirclePartSlot,
  props: CircleRuntimePartProps,
): JSX.Element {
  const appearance = useProgressCircleAppearance();
  const part = partComponents[slot];
  const [local, native] = splitProps(props, [
    'children',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'strokeLinecap',
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
    /** Keep the primitive's native SVG props and events reactive. */
    () => native,
    {
      /** Preserve a selected SVG or HTML ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `progress-circle__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation without hiding the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Use the browser's SVG spelling for Solid's camel-case alias. */
      get 'stroke-linecap'() {
        return local.strokeLinecap ?? native['stroke-linecap'];
      },
      /** Let the primitive supply default value text when children are absent. */
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

  // The registry pairs each SVG or HTML slot with its primitive component.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
