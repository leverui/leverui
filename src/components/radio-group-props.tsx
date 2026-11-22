import type { PolymorphicProps } from '../primitives/components/factory';
import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeRecipeProps } from './recipe-props-merge';
import type { RadioGroupChoice, RadioGroupSize, RadioGroupVariant } from './radio-group-choices';
import type { UseRadioGroupProps, UseRadioGroupReturn } from './radio-group-machine';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type ChildRenderer = NonNullable<PolymorphicProps<'div'>['asChild']>;

export interface RadioGroupPresentationProps {
  /** Select finite group and mark dimensions at ordinary breakpoints. */
  size?: RadioGroupChoice<RadioGroupSize> | undefined;
  /** Select a finite shared mark treatment. */
  variant?: RadioGroupChoice<RadioGroupVariant> | undefined;
  /** Select inherited semantic palette variables. */
  colorPalette?: string | undefined;
  /** Suppress authored presentation while retaining the primitive behavior and hooks. */
  unstyled?: boolean | undefined;
  /** Accept the alternate native HTML class spelling. */
  className?: string | undefined;
}

export type RadioGroupRootBaseProps = UseRadioGroupProps & RadioGroupPresentationProps;
type ProviderBaseProps = { value: UseRadioGroupReturn } & RadioGroupPresentationProps;

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

export type RadioGroupRootProps<As extends IntrinsicElement = 'div'> =
  NativeRootProps<As, RadioGroupRootBaseProps> | ChildRootProps<RadioGroupRootBaseProps>;

export type RadioGroupRootProviderProps<As extends IntrinsicElement = 'div'> =
  NativeRootProps<As, ProviderBaseProps> | ChildRootProps<ProviderBaseProps>;

export type RadioGroupRuntimeRootProps = JSX.HTMLAttributes<HTMLElement> &
  RadioGroupRootBaseProps & {
    as?: IntrinsicElement | undefined;
    asChild?: ChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export type RadioGroupRuntimeProviderProps = JSX.HTMLAttributes<HTMLElement> &
  ProviderBaseProps & {
    as?: IntrinsicElement | undefined;
    asChild?: ChildRenderer | undefined;
    ref?: unknown | undefined;
  };

export interface RadioGroupPropsProviderProps {
  value: Partial<RadioGroupRootBaseProps> | Accessor<Partial<RadioGroupRootBaseProps>>;
  children: JSX.Element;
}

const RadioGroupPropsContext = createOptionalContext<Accessor<Partial<RadioGroupRootBaseProps>>>();

/** Supply reactive defaults without owning a descendant radio machine. */
export function RadioGroupPropsProvider(props: RadioGroupPropsProviderProps): JSX.Element {
  /** Read the latest object or accessor supplied by the consumer. */
  function readDefaults(): Partial<RadioGroupRootBaseProps> {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <RadioGroupPropsContext value={readDefaults}>{props.children}</RadioGroupPropsContext>;
}

/** Give instance props precedence over inherited machine and CSS choices. */
export function useRadioGroupRootProps(
  instance: RadioGroupRuntimeRootProps,
): RadioGroupRuntimeRootProps {
  const inherited = useOptionalContext(RadioGroupPropsContext);
  return mergeRecipeProps<RadioGroupRuntimeRootProps>(
    /** Follow changing provider defaults without remounting the primitive. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit presentation without changing the caller-owned radio machine. */
export function useRadioGroupRootProviderProps(
  instance: RadioGroupRuntimeProviderProps,
): RadioGroupRuntimeProviderProps {
  const inherited = useOptionalContext(RadioGroupPropsContext);
  return mergeRecipeProps<RadioGroupRuntimeProviderProps>(
    /** Keep machine state off an external store. */
    () => {
      const defaults = inherited?.() ?? {};
      return {
        size: defaults.size,
        variant: defaults.variant,
        colorPalette: defaults.colorPalette,
        unstyled: defaults.unstyled,
      };
    },
    instance,
  );
}
