import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import { mergeProps } from '../merge-props';
import { omit } from '../utils/omit';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { AvatarAppearance } from './avatar-appearance';
import type { GroupPropsWithOmitted } from './group';
import type { NativeElementTag } from './native-element-props';
import type { UseAvatarProps, UseAvatarReturn } from './avatar-types';

export type AvatarRootBaseProps = UseAvatarProps & AvatarAppearance & { className?: string };
export type AvatarRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  AvatarRootBaseProps,
  As
>;
export type AvatarRootProviderBaseProps = { value: UseAvatarReturn } & AvatarAppearance & {
    className?: string;
  };
export type AvatarRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', AvatarRootProviderBaseProps, As>;
export type AvatarImageProps<As extends PrimitiveNativeTag = 'img'> = PrimitiveNativeElementProps<
  'img',
  { unstyled?: boolean; className?: string },
  As
>;
export type AvatarFallbackProps<As extends PrimitiveNativeTag = 'span'> =
  PrimitiveNativeElementProps<
    'span',
    { name?: string | undefined; unstyled?: boolean; className?: string },
    As
  >;
export type AvatarIconProps = JSX.IntrinsicElements['svg'];
export type AvatarGroupProps<As extends NativeElementTag = NativeElementTag> =
  GroupPropsWithOmitted<As, keyof AvatarAppearance> & AvatarAppearance;

type AvatarDefaults = Partial<AvatarRootBaseProps>;

export interface AvatarPropsProviderProps {
  value: AvatarDefaults | Accessor<AvatarDefaults>;
  children: JSX.Element;
}

const AvatarPropsContext = createOptionalContext<Accessor<AvatarDefaults>>();
const machineKeys = ['id', 'ids', 'onStatusChange'] as const;

/** Supply reactive Avatar defaults without owning the descendant's machine. */
export function AvatarPropsProvider(props: AvatarPropsProviderProps): JSX.Element {
  /** Read static or reactive defaults at the point of use. */
  function readDefaults(): AvatarDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <AvatarPropsContext value={readDefaults}>{props.children}</AvatarPropsContext>;
}

/** Merge the nearest Avatar defaults with live instance props. */
export function useAvatarProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(AvatarPropsContext);
  return mergeProps(
    /** Re-read a changed provider value without replacing the Avatar root. */
    () => inherited?.() ?? {},
    instance,
  ) as Props;
}

/** Keep external store state separate from inherited Avatar styling defaults. */
export function useAvatarRootProviderProps<Props extends object>(instance: Props): Props {
  const inherited = useOptionalContext(AvatarPropsContext);
  return mergeProps(
    /** Omit machine settings already owned by the external Avatar accessor. */
    () => omit(inherited?.() ?? {}, machineKeys),
    instance,
  ) as Props;
}
