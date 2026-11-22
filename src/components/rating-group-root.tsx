import { splitProps } from '../primitives/utils/split-props';
import { RatingGroup as PrimitiveRatingGroup } from '../primitives/components/rating-group';
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
import {
  RatingGroupAppearanceProvider,
  type RatingGroupAppearanceState,
} from './rating-group-appearance';
import { ratingGroupAttributes } from './rating-group-attributes';
import type { RatingGroupAppearance } from './rating-group-choices';
import type { UseRatingGroupProps, UseRatingGroupReturn } from './rating-group-machine';
import {
  useRatingGroupRootProps,
  useRatingGroupRootProviderProps,
  type RatingGroupRootProps,
  type RatingGroupRootProviderProps,
} from './rating-group-props';
import type { ClassValue } from '../utils/class-value';

type RuntimeRootProps = UseRatingGroupProps &
  RatingGroupAppearance &
  NativeHtmlAliases & {
    class?: ClassValue | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeProviderProps = Omit<RuntimeRootProps, keyof UseRatingGroupProps | 'value'> & {
  value: UseRatingGroupReturn;
};
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Bind authored CSS hooks around either primitive Rating Group root mode. */
function renderRatingGroupRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part =
    input.mode === 'root' ? PrimitiveRatingGroup.Root : PrimitiveRatingGroup.RootProvider;
  const [local, native] = splitProps(input.props, [
    'size',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: RatingGroupAppearanceState = {
    /** Follow the root's changing unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine options and native attributes reactively. */
    () => native,
    /** Convert html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Expose finite CSS choices without inserted styles. */
    () => ratingGroupAttributes(local),
    {
      /** Forward the caller ref to the selected native element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'rating-group__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Resolve children beneath the primitive's rating context. */
      get children() {
        return content.children;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <RatingGroupAppearanceProvider value={appearance}>
      {/* The primitive's root modes share this native forwarding contract. */}
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </RatingGroupAppearanceProvider>
  );
}

/** Render a Rating Group with its own primitive and Zag machine. */
function RatingGroupRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRatingGroupRoot({ mode: 'root', props: useRatingGroupRootProps(instance) }, content);
}

/** Expose native, selected-tag, and caller-owned Rating Group roots. */
export const RatingGroupRoot = RatingGroupRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: RatingGroupRootProps<As>,
) => JSX.Element;

/** Render a Rating Group around a caller-owned primitive machine. */
function RatingGroupRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderRatingGroupRoot(
    { mode: 'provider', props: useRatingGroupRootProviderProps(instance) },
    content,
  );
}

/** Require an external rating machine on provider roots. */
export const RatingGroupRootProvider = RatingGroupRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: RatingGroupRootProviderProps<As>,
) => JSX.Element;
