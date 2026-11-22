import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { UsePaginationProps, UsePaginationReturn } from './pagination-machine';

export interface PaginationAppearanceProps {
  unstyled?: boolean | undefined;
  className?: string | undefined;
}
export type PaginationRootBaseProps = UsePaginationProps & PaginationAppearanceProps;
export type PaginationRootProps<As extends PrimitiveNativeTag = 'nav'> =
  PrimitiveNativeElementProps<'nav', PaginationRootBaseProps, As>;
export type PaginationRootProviderProps<As extends PrimitiveNativeTag = 'nav'> =
  PrimitiveNativeElementProps<
    'nav',
    { value: UsePaginationReturn } & PaginationAppearanceProps,
    As
  >;
type PaginationRootDefaults = Partial<PaginationRootBaseProps>;

export interface PaginationPropsProviderProps {
  value: PaginationRootDefaults | Accessor<PaginationRootDefaults>;
  children: JSX.Element;
}

const PaginationPropsContext = createOptionalContext<Accessor<PaginationRootDefaults>>();

/** Supply reactive machine and appearance defaults to nested Pagination roots. */
export function PaginationPropsProvider(props: PaginationPropsProviderProps): JSX.Element {
  /** Read static defaults or the caller's current Solid accessor. */
  function readDefaults(): PaginationRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <PaginationPropsContext value={readDefaults}>{props.children}</PaginationPropsContext>;
}

/** Merge inherited defaults before a machine-owned Pagination root. */
export function usePaginationRootProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(PaginationPropsContext);
  return mergeProps(
    /** Keep instance machine props after inherited defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Inherit appearance without replacing a caller-owned machine. */
export function usePaginationRootProviderProps<
  Props extends PaginationAppearanceProps & { value: UsePaginationReturn },
>(instance: Props): Props {
  const inherited = useOptionalContext(PaginationPropsContext);
  return mergeProps(
    /** Leave machine settings on the external accessor. */
    () => {
      const defaults = inherited?.();
      return { unstyled: defaults?.unstyled };
    },
    instance,
  ) as Props;
}
