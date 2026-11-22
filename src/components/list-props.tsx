import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import type { RenderChild } from '../styled-system/child-props';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import type { ListAlignment, ListVariant, ResponsiveListChoice } from './list-choices';
import type { ListPartOptions, ListPartProps } from './list-part-props';

export interface ListRootBaseProps extends ListPartOptions {
  /** Choose marker or plain presentation at ordinary breakpoints. */
  variant?: ResponsiveListChoice<ListVariant> | undefined;
  /** Align item content at ordinary breakpoints. */
  align?: ResponsiveListChoice<ListAlignment> | undefined;
}

type NativeListProps<Tag extends NativeElementTag, Behavior, As extends NativeElementTag> = Exclude<
  NativeElementProps<Tag, Behavior, As>,
  { asChild: RenderChild }
>;

type ChildListProps<
  Tag extends NativeElementTag,
  Behavior,
  ChildElement extends HTMLElement,
> = Omit<JSX.IntrinsicElements[Tag], keyof Behavior | 'ref'> &
  Behavior & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: ChildElement) => void) | undefined;
  };

export type ListRootProps<As extends NativeElementTag = 'ul'> =
  | NativeListProps<'ul', ListRootBaseProps, As>
  | ChildListProps<'ul', ListRootBaseProps, HTMLElement>;
export type ListRootRuntimeProps = Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'ref' | keyof ListRootBaseProps
> &
  ListRootBaseProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
  };
export type ListItemProps<As extends NativeElementTag = 'li'> =
  NativeListProps<'li', ListPartOptions, As> | ChildListProps<'li', ListPartOptions, HTMLLIElement>;
export type ListIndicatorProps<As extends NativeElementTag = 'span'> = ListPartProps<As>;
export type { ListIndicatorGetChildProps, ListIndicatorRenderChild } from './list-part-props';

export interface ListRootPropsProviderProps {
  value: ListRootBaseProps | Accessor<ListRootBaseProps>;
  children: JSX.Element;
}

const ListPropsContext = createOptionalContext<Accessor<ListRootBaseProps>>();

/** Supply reactive List defaults to descendant roots. */
export function ListRootPropsProvider(props: ListRootPropsProviderProps): JSX.Element {
  /** Read current defaults in a tracked descendant scope. */
  function readDefaults(): ListRootBaseProps {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <ListPropsContext value={readDefaults}>{props.children}</ListPropsContext>;
}

/** Merge the nearest List defaults with live root props. */
export function useListProps(instance: ListRootRuntimeProps): ListRootRuntimeProps {
  const inherited = useOptionalContext(ListPropsContext);
  return mergeProps(
    /** Read current shared choices without copying the caller's children. */
    () => inherited?.() ?? {},
    instance,
  );
}
