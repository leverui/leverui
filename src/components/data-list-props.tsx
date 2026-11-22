import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type {
  DataListOrientation,
  DataListSize,
  DataListVariant,
  ResponsiveDataListChoice,
} from './data-list-choices';
import type { NativeElementProps, NativeElementTag } from './native-element-props';

export interface DataListRootBaseProps {
  /** Set the description list's spacing and text scale. */
  size?: ResponsiveDataListChoice<DataListSize> | undefined;
  /** Arrange each term and value vertically or horizontally. */
  orientation?: ResponsiveDataListChoice<DataListOrientation> | undefined;
  /** Select muted labels or emphasized labels. */
  variant?: ResponsiveDataListChoice<DataListVariant> | undefined;
  /** Omit authored presentation while retaining semantic markup. */
  unstyled?: boolean | undefined;
}

export interface DataListPartOptions {
  /** Omit authored presentation for this part. */
  unstyled?: boolean | undefined;
}

type NativeDataListProps<
  Tag extends NativeElementTag,
  Behavior,
  As extends NativeElementTag,
> = Exclude<NativeElementProps<Tag, Behavior, As>, { asChild: RenderChild }>;

type ChildDataListProps<
  Tag extends NativeElementTag,
  Behavior,
  ChildElement extends HTMLElement,
> = Omit<JSX.IntrinsicElements[Tag], keyof Behavior | 'ref'> &
  Behavior & { as?: never; asChild: RenderChild; ref?: (element: ChildElement) => void };

export type DataListRootProps<As extends NativeElementTag = 'dl'> =
  | NativeDataListProps<'dl', DataListRootBaseProps, As>
  | ChildDataListProps<'dl', DataListRootBaseProps, HTMLElement>;
export type DataListItemProps<As extends NativeElementTag = 'div'> =
  | NativeDataListProps<'div', DataListPartOptions, As>
  | ChildDataListProps<'div', DataListPartOptions, HTMLDivElement>;
export type DataListItemLabelProps<As extends NativeElementTag = 'dt'> =
  | NativeDataListProps<'dt', DataListPartOptions, As>
  | ChildDataListProps<'dt', DataListPartOptions, HTMLElement>;
export type DataListItemValueProps<As extends NativeElementTag = 'dd'> =
  | NativeDataListProps<'dd', DataListPartOptions, As>
  | ChildDataListProps<'dd', DataListPartOptions, HTMLElement>;

export type DataListRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof DataListRootBaseProps
> &
  DataListRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export type DataListPartRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof DataListPartOptions
> &
  DataListPartOptions & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    className?: string | undefined;
    ref?: ((element: Element) => void) | undefined;
  };

export interface DataListPropsProviderProps {
  value: DataListRootBaseProps | Accessor<DataListRootBaseProps>;
  children: JSX.Element;
}

const DataListPropsContext = createOptionalContext<Accessor<DataListRootBaseProps>>();

/** Supply reactive Data List choices to descendant roots. */
export function DataListPropsProvider(props: DataListPropsProviderProps): JSX.Element {
  /** Read current defaults where a descendant tracks them. */
  function readDefaults(): DataListRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }
  return <DataListPropsContext value={readDefaults}>{props.children}</DataListPropsContext>;
}

/** Merge nearest Data List defaults with live root props. */
export function useDataListProps(instance: DataListRootRuntimeProps): DataListRootRuntimeProps {
  const inherited = useOptionalContext(DataListPropsContext);
  return mergeProps(
    /** Keep explicit root choices ahead of changing provider defaults. */
    () => inherited?.() ?? {},
    instance,
  );
}
