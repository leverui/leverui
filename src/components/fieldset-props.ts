import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import type { UseFieldsetProps, UseFieldsetReturn } from './fieldset-contract';

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

type FieldsetElementProps<Tag extends keyof JSX.IntrinsicElements> =
  NativePartProps<Tag> | SelectedPartProps<Tag>;

export type FieldsetRootBaseProps = UseFieldsetProps & {
  /** Select authored spacing and legend size at ordinary breakpoints. */
  size?: FiniteResponsiveChoice<'sm' | 'md' | 'lg'> | undefined;
  /** Suppress default presentation without changing native or primitive behavior. */
  unstyled?: boolean | undefined;
};
export type FieldsetRootProps = FieldsetElementProps<'fieldset'> & FieldsetRootBaseProps;
export type FieldsetRootProviderProps = FieldsetElementProps<'fieldset'> &
  FieldsetRootBaseProps & { value: UseFieldsetReturn };
export type FieldsetLegendProps = FieldsetElementProps<'legend'>;
export type FieldsetHelperTextProps = FieldsetElementProps<'span'>;
export type FieldsetErrorTextProps = FieldsetElementProps<'span'>;
export type FieldsetContentProps = FieldsetElementProps<'div'>;
