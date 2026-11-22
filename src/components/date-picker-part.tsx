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
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { CarouselChevronLeftIcon, CarouselChevronRightIcon } from './carousel-icons';
import { CloseIcon } from './close-icon';
import { datePickerAppearanceAttributes, useDatePickerAppearance } from './date-picker-appearance';
import { useDatePickerContext, type DatePickerValueTextRenderProps } from './date-picker-machine';
import type { DatePickerPartBehavior } from './date-picker-part-behavior';
import {
  datePickerPartComponents,
  datePickerPartTags,
  type DatePickerPartSlot,
} from './date-picker-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps<Tag extends PrimitiveNativeTag> = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<Tag>['asChild'] | undefined;
  'data-type'?: string | undefined;
  'aria-label'?: string | false | undefined;
  children?: (JSX.Element | ((props: DatePickerValueTextRenderProps) => JSX.Element)) | undefined;
};
type DatePickerPartInput = {
  [Slot in DatePickerPartSlot]: {
    slot: Slot;
    props: RuntimePartProps<(typeof datePickerPartTags)[Slot]> & DatePickerPartBehavior<Slot>;
  };
}[DatePickerPartSlot];

/** Supply trigger glyphs when the caller did not provide children. */
function defaultChildren(slot: DatePickerPartSlot): JSX.Element | undefined {
  if (slot === 'clearTrigger') return <CloseIcon />;
  if (slot === 'prevTrigger') return <CarouselChevronLeftIcon />;
  if (slot === 'nextTrigger') return <CarouselChevronRightIcon />;
  return undefined;
}

/** Forward one native DatePicker part while the primitive owns calendar behavior. */
export function renderDatePickerPart(input: DatePickerPartInput): JSX.Element {
  const { slot, props } = input;
  const appearance = useDatePickerAppearance();
  const part = datePickerPartComponents[slot] as Component<object>;
  let defaultChild: JSX.Element | undefined;
  let defaultChildCreated = false;
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the native tag selected by the caller. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? datePickerPartTags[slot];
  }

  /** Forward the caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  // Zag 2 no longer names each calendar grid; keep Zag 1's visible-range name.
  const datePicker = slot === 'table' ? useDatePickerContext() : undefined;

  const primitiveProps = mergeProps(
    /** Forward native and date-machine attributes without style extraction. */
    () => native,
    /** Name a calendar grid by its visible range unless the caller names it. */
    () =>
      datePicker
        ? { 'aria-label': props['aria-label'] ?? datePicker().visibleRangeText.formatted }
        : {},
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Keep finite selectors on parts moved into a portal. */
    () => datePickerAppearanceAttributes(appearance),
    {
      /** Preserve the caller ref on the primitive's default element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `date-picker__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Suppress authored presentation for this part or root. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Name the Lever-owned indicator group the way the primitive names its own parts. */
      get 'data-date-picker-indicator-group'() {
        return slot === 'indicatorGroup' ? '' : undefined;
      },
      /** Name the Lever-owned week number text the way the primitive names its own parts. */
      get 'data-date-picker-week-number-cell-text'() {
        return slot === 'weekNumberCellText' ? '' : undefined;
      },
      /** Apply the week-number styling state. */
      get 'data-type'() {
        if (slot === 'weekNumberCell' || slot === 'weekNumberHeaderCell') {
          return props['data-type'] ?? 'week-number';
        }
        return props['data-type'];
      },
      /** Preserve caller children and cache default glyphs across updates. */
      get children() {
        const children = content.children;
        if (children !== undefined) return children;
        if (!defaultChildCreated) {
          defaultChild = defaultChildren(slot);
          defaultChildCreated = true;
        }
        return defaultChild;
      },
      /** Preserve caller-rendered children or selected native elements. */
      get asChild() {
        if (local.asChild) {
          // The primitive's mixed slot signatures erase the child callback tag here.
          return primitiveChildWithRef(
            local.asChild as NonNullable<PolymorphicProps<'div'>['asChild']>,
            readRef,
          );
        }
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}
