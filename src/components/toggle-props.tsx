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
import type { UseToggleProps } from './toggle-machine';
import type { ToggleRuntimeRootProps } from './toggle-runtime-props';

export type ToggleRootBaseProps = UseToggleProps & {
  unstyled?: boolean;
} & PrimitiveCompositionProps<'button'>;
export type ToggleRootProps<As extends PrimitiveNativeTag = 'button'> = PrimitiveNativeElementProps<
  'button',
  ToggleRootBaseProps & NativeHtmlAliases,
  As
>;
export type ToggleIndicatorProps<As extends PrimitiveNativeTag = 'span'> =
  PrimitiveNativeElementProps<
    'span',
    { fallback?: JSX.Element; unstyled?: boolean } & NativeHtmlAliases,
    As
  >;

type ToggleRootDefaults = Partial<Omit<ToggleRootBaseProps, 'children' | 'ref' | 'asChild'>> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export interface TogglePropsProviderProps {
  value: ToggleRootDefaults | Accessor<ToggleRootDefaults>;
  children: JSX.Element;
}

const TogglePropsContext = createOptionalContext<Accessor<ToggleRootDefaults>>();

/** Supply reactive machine and native defaults to descendant Toggle roots. */
export function TogglePropsProvider(props: TogglePropsProviderProps): JSX.Element {
  /** Read the current defaults without owning a descendant's machine. */
  function readDefaults(): ToggleRootDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <TogglePropsContext value={readDefaults}>{props.children}</TogglePropsContext>;
}

/** Merge inherited defaults before the primitive initializes the Toggle machine. */
export function useToggleRootProps(instance: ToggleRuntimeRootProps): ToggleRuntimeRootProps {
  const inherited = useOptionalContext(TogglePropsContext);
  return mergeProps(
    /** Retain explicit root props ahead of changing defaults. */
    () => inherited?.() ?? {},
    instance,
  ) as ToggleRuntimeRootProps;
}
