import { splitProps } from '../primitives/utils/split-props';
import { primitive, type PolymorphicProps } from '../primitives/components/factory';
import { useStepsItemContext } from '../primitives/components/steps';
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
import type { StepsNumberProps } from './steps-part-props';
import type { ClassValue } from '../utils/class-value';

export interface StepsStatusProps {
  complete: JSX.Element;
  incomplete: JSX.Element;
  current?: JSX.Element;
}

type RuntimeNumberProps = NativeHtmlAliases & {
  class?: ClassValue | undefined;
  className?: string | undefined;
  unstyled?: boolean | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
};

/** Render status-specific content for the nearest Steps item. */
export function StepsStatus(props: StepsStatusProps): JSX.Element {
  const item = useStepsItemContext();
  return (
    <>
      {item().current
        ? (props.current ?? props.incomplete)
        : item().completed
          ? props.complete
          : (props.incomplete ?? props.current)}
    </>
  );
}

/** Render the nearest item's one-based number with native attributes. */
function StepsNumberImpl(props: RuntimeNumberProps): JSX.Element {
  const item = useStepsItemContext();
  const [local, native] = splitProps(props, [
    'class',
    'className',
    'unstyled',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow a caller-selected native number tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the current number ref through child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const attributes = mergeProps(
    /** Preserve native number attributes. */
    () => native,
    /** Convert public native aliases. */
    () => nativeHtmlAttributes(local),
    {
      /** Preserve a callback ref on the actual number element. */
      get ref() {
        return local.ref;
      },
      /** Keep the number independently targetable by consumer CSS. */
      get class() {
        return composeRecipeClassNames('steps__number', undefined, local.class, local.className);
      },
      /** Keep consumer presentation active when default styling is disabled. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Read the current item index after machine updates. */
      get children() {
        return item().index + 1;
      },
      /** Preserve a caller-owned child or selected native tag. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );
  return createComponent(primitive.div as Component<typeof attributes>, attributes);
}

/** Expose native, selected-tag, and child number paths. */
export const StepsNumber = StepsNumberImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: StepsNumberProps<As>,
) => JSX.Element;

/** Draw the decorative completed-step check. */
export function StepsCheckIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
