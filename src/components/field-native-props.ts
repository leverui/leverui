import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';

type NativePartProps<Tag extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[Tag],
  'as' | 'asChild' | 'render'
> &
  NativeHtmlAliases & {
    as?: never;
    asChild?: never;
    render?: never;
    className?: string;
    unstyled?: boolean;
  };

type SelectedPartProps<Tag extends keyof JSX.IntrinsicElements> = Omit<
  JSX.IntrinsicElements[Tag],
  'as' | 'asChild' | 'render' | 'ref'
> &
  NativeHtmlAliases & {
    ref?: ((element: Element) => void) | undefined;
    className?: string;
    unstyled?: boolean;
  } & (
    | { as: keyof JSX.IntrinsicElements; asChild?: never; render?: never }
    | { as?: never; asChild: NonNullable<PolymorphicProps<Tag>['asChild']>; render?: never }
    | { as?: never; asChild?: never; render: RenderFn<Tag, unknown> }
  );

/** Keep Field native and caller-selected elements free of style-object props. */
export type FieldElementProps<Tag extends keyof JSX.IntrinsicElements> =
  NativePartProps<Tag> | SelectedPartProps<Tag>;
