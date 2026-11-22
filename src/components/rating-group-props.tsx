import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type {
  PrimitiveCompositionProps,
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { RatingGroupAppearance } from './rating-group-choices';
import type { UseRatingGroupProps, UseRatingGroupReturn } from './rating-group-machine';

export type RatingGroupRootBaseProps = UseRatingGroupProps &
  RatingGroupAppearance &
  PrimitiveCompositionProps<'div'>;
export type RatingGroupRootProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', RatingGroupRootBaseProps & NativeHtmlAliases, As>;
export type RatingGroupRootProviderBaseProps = RatingGroupAppearance &
  PrimitiveCompositionProps<'div'> & { value: UseRatingGroupReturn };
export type RatingGroupRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', RatingGroupRootProviderBaseProps & NativeHtmlAliases, As>;

type RootDefaults = Partial<Omit<RatingGroupRootBaseProps, 'children' | 'ref' | 'as' | 'asChild'>> &
  Omit<JSX.HTMLAttributes<HTMLElement>, 'children' | 'ref' | 'as' | 'asChild'>;

export interface RatingGroupPropsProviderProps {
  value: RootDefaults | Accessor<RootDefaults>;
  children: JSX.Element;
}

const RatingGroupPropsContext = createOptionalContext<Accessor<RootDefaults>>();

/** Supply reactive machine and appearance defaults to nested Rating Group roots. */
export function RatingGroupPropsProvider(props: RatingGroupPropsProviderProps): JSX.Element {
  /** Read changing defaults without owning a descendant machine. */
  function readDefaults(): RootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <RatingGroupPropsContext value={readDefaults}>{props.children}</RatingGroupPropsContext>;
}

/** Merge inherited defaults before one machine-owned Rating Group root. */
export function useRatingGroupRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(RatingGroupPropsContext);
  return mergeProps(
    /** Follow provider defaults without remounting the primitive. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without passing machine defaults to a caller-owned store. */
export function useRatingGroupRootProviderProps<
  Props extends RatingGroupAppearance & { value: UseRatingGroupReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(RatingGroupPropsContext);
  return mergeProps(
    /** Keep the external machine authoritative over its own settings. */
    () => {
      const defaults = inherited?.() ?? {};
      return {
        size: defaults.size,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
        class: defaults.class,
        className: defaults.className,
        style: defaults.style,
      };
    },
    instance,
  ) as Props;
}
