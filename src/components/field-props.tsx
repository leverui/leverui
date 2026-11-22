import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type { FiniteResponsiveChoice } from './finite-responsive-choice';
import type { FieldElementProps } from './field-native-props';
import type { FieldOrientation } from './field-orientation';
import { mergeRecipeProps } from './recipe-props-merge';
import type { UseFieldProps, UseFieldReturn } from './field-contract';

type FieldAppearanceProps = {
  orientation?: FiniteResponsiveChoice<FieldOrientation> | undefined;
  unstyled?: boolean | undefined;
};
export type FieldRootBaseProps = UseFieldProps & FieldAppearanceProps;
export type FieldRootProps = FieldElementProps<'div'> & FieldRootBaseProps;
export type FieldRootProviderProps = FieldElementProps<'div'> &
  FieldAppearanceProps & { value: UseFieldReturn };
export type FieldLabelProps = FieldElementProps<'label'>;
export type FieldHelperTextProps = FieldElementProps<'span'>;
export type FieldErrorTextProps = FieldElementProps<'span'>;
export type FieldRequiredIndicatorProps = FieldElementProps<'span'> & {
  fallback?: JSX.Element;
};
export type FieldItemProps = { value: string; children?: JSX.Element };
export type FieldDefaults = Partial<
  Omit<FieldRootProps, 'children' | 'ref' | 'asChild' | 'render'>
>;

export interface FieldPropsProviderProps {
  value: FieldDefaults | Accessor<FieldDefaults>;
  children: JSX.Element;
}

const FieldPropsContext = createOptionalContext<Accessor<FieldDefaults>>();

/** Supply reactive Field defaults to descendant roots. */
export function FieldPropsProvider(props: FieldPropsProviderProps): JSX.Element {
  /** Read the current object or accessor supplied by the consumer. */
  function readDefaults(): FieldDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <FieldPropsContext value={readDefaults}>{props.children}</FieldPropsContext>;
}

/** Merge inherited defaults while keeping instance props authoritative. */
export function useFieldProps(instance: FieldRootProps): FieldRootProps {
  const inherited = useOptionalContext(FieldPropsContext);
  return mergeRecipeProps<FieldRootProps>(
    /** Track inherited values independently of instance overrides. */
    () => inherited?.() ?? {},
    instance,
  );
}
