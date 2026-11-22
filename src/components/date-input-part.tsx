import { splitProps } from '../primitives/utils/split-props';
import type { DateInputSegmentProps as PrimitiveSegmentProps } from '../primitives/components/date-input';
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
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { dateInputAppearanceAttributes, useDateInputAppearance } from './date-input-appearance';
import type { DateInputPartBehavior } from './date-input-part-props';
import {
  dateInputPartComponents,
  dateInputPartTags,
  type DateInputPartSlot,
} from './date-input-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  segment?: PrimitiveSegmentProps['segment'] | undefined;
  index?: number | undefined;
  name?: string | undefined;
  children?: JSX.Element | undefined;
};
type DateInputPartInput = {
  [Slot in DateInputPartSlot]: {
    slot: Slot;
    props: RuntimePartProps<(typeof dateInputPartTags)[Slot]> & DateInputPartBehavior<Slot>;
  };
}[DateInputPartSlot];

/** Forward one native DateInput part while the primitive owns segment behavior. */
export function renderDateInputPart(input: DateInputPartInput): JSX.Element {
  const { slot, props } = input;
  const part = dateInputPartComponents[slot];
  const appearance = useDateInputAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? dateInputPartTags[slot];
  }

  /** Forward the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward segment, form, and native attributes unchanged. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Keep finite choices on each native part. */
    () => dateInputAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Keep the stable slot hook beside consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `date-input__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation for a root or one part. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve a caller-owned child or selected native part. */
      get asChild() {
        const child = local.asChild;
        if (child) {
          return primitiveChildWithRef(
            child as NonNullable<PolymorphicProps<'div'>['asChild']>,
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
      /** Retain the caller's JSX getter for hydration identity. */
      get children() {
        return content.children;
      },
    },
  );
  // The discriminated input binds each primitive part to its corresponding props.
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
