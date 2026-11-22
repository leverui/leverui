import type { PolymorphicProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';
import type { NativeHtmlAliases } from '../styled-system/native-html-aliases';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { UseTagsInputReturn } from './tags-input-machine';
import type { TagsInputAppearanceProps, TagsInputRootBaseProps } from './tags-input-props';
import type { ClassValue } from '../utils/class-value';

type RootNativeProps = NativeHtmlAliases & {
  class?: ClassValue | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
};

/** Keep machine-owned root props precise across the primitive's rendering boundary. */
export type TagsInputRenderRootProps = RootNativeProps & TagsInputRootBaseProps;

/** Require an external machine without inheriting owned-machine options. */
export type TagsInputRenderProviderProps = RootNativeProps &
  TagsInputAppearanceProps & { value: UseTagsInputReturn };
