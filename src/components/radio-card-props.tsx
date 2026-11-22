import type { PolymorphicProps } from '../primitives/components/factory';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeRecipeProps } from './recipe-props-merge';
import type {
  RadioCardAlignment,
  RadioCardChoice,
  RadioCardOrientation,
  RadioCardSize,
  RadioCardVariant,
} from './radio-card-choices';
import type { UseRadioCardGroupProps, UseRadioCardGroupReturn } from './radio-card-machine';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type ChildRenderer = NonNullable<PolymorphicProps<'div'>['asChild']>;

export interface RadioCardPresentationProps {
  /** Select finite Card dimensions at ordinary breakpoints. */
  size?: RadioCardChoice<RadioCardSize> | undefined;
  /** Select one of the authored Card surface treatments. */
  variant?: RadioCardChoice<RadioCardVariant> | undefined;
  /** Align content within each Card. */
  align?: RadioCardChoice<RadioCardAlignment> | undefined;
  /** Justify content within each Card. */
  justify?: RadioCardChoice<RadioCardAlignment> | undefined;
  /** Arrange each Card's control horizontally or vertically. */
  orientation?: RadioCardOrientation | undefined;
  /** Select inherited semantic palette variables. */
  colorPalette?: string | undefined;
  /** Suppress authored presentation without changing radio behavior. */
  unstyled?: boolean | undefined;
  /** Accept the alternate native HTML class spelling. */
  className?: string | undefined;
}

export type RadioCardRootBaseProps = UseRadioCardGroupProps & RadioCardPresentationProps;
type ProviderBaseProps = { value: UseRadioCardGroupReturn } & RadioCardPresentationProps;

type NativeRootProps<As extends IntrinsicElement, Base extends object> = As extends IntrinsicElement
  ? Omit<JSX.IntrinsicElements[NoInfer<As>], keyof Base | 'as' | 'asChild'> &
      Base &
      (As extends 'div' ? { as?: As } : { as: As }) & { asChild?: undefined }
  : never;

type ChildRootProps<Base extends object> = Omit<
  JSX.IntrinsicElements['div'],
  keyof Base | 'as' | 'asChild' | 'ref'
> &
  Base & { as?: never; asChild: ChildRenderer; ref?: (element: HTMLElement) => void };

export type RadioCardRootProps<As extends IntrinsicElement = 'div'> =
  NativeRootProps<As, RadioCardRootBaseProps> | ChildRootProps<RadioCardRootBaseProps>;

export type RadioCardRootProviderProps<As extends IntrinsicElement = 'div'> =
  NativeRootProps<As, ProviderBaseProps> | ChildRootProps<ProviderBaseProps>;

export type RadioCardRuntimeRootProps = JSX.HTMLAttributes<HTMLElement> &
  RadioCardRootBaseProps & {
    as?: IntrinsicElement | undefined;
    asChild?: ChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export type RadioCardRuntimeProviderProps = JSX.HTMLAttributes<HTMLElement> &
  ProviderBaseProps & {
    as?: IntrinsicElement | undefined;
    asChild?: ChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export interface RadioCardPropsProviderProps {
  value: Partial<RadioCardRootBaseProps> | Accessor<Partial<RadioCardRootBaseProps>>;
  children: JSX.Element;
}

const RadioCardPropsContext = createOptionalContext<Accessor<Partial<RadioCardRootBaseProps>>>();

/** Supply reactive machine and appearance defaults to nested Card roots. */
export function RadioCardPropsProvider(props: RadioCardPropsProviderProps): JSX.Element {
  /** Read changing defaults without owning a descendant radio machine. */
  function readDefaults(): Partial<RadioCardRootBaseProps> {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <RadioCardPropsContext value={readDefaults}>{props.children}</RadioCardPropsContext>;
}

/** Merge inherited defaults before one machine-owned Card root. */
export function useRadioCardRootProps(
  instance: RadioCardRuntimeRootProps,
): RadioCardRuntimeRootProps {
  const inherited = useOptionalContext(RadioCardPropsContext);
  return mergeRecipeProps<RadioCardRuntimeRootProps>(
    /** Follow changing provider defaults while keeping instance props last. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned radio machine. */
export function useRadioCardRootProviderProps(
  instance: RadioCardRuntimeProviderProps,
): RadioCardRuntimeProviderProps {
  const inherited = useOptionalContext(RadioCardPropsContext);
  return mergeRecipeProps<RadioCardRuntimeProviderProps>(
    /** Keep selection and form defaults off the external store. */
    () => {
      const defaults = inherited?.() ?? {};
      return {
        size: defaults.size,
        variant: defaults.variant,
        align: defaults.align,
        justify: defaults.justify,
        orientation: defaults.orientation,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
      };
    },
    instance,
  );
}
