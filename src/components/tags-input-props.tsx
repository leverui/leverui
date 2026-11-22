import { type Accessor } from 'solid-js';
import { createOptionalContext, useOptionalContext } from '../primitives/utils/optional-context';
import { type JSX } from '@solidjs/web';
import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { TagsInputSizeChoice, TagsInputVariantChoice } from './tags-input-appearance';
import { mergeRecipeProps } from './recipe-props-merge';
import type { UseTagsInputProps, UseTagsInputReturn } from './tags-input-machine';
import type {
  TagsInputRenderProviderProps,
  TagsInputRenderRootProps,
} from './tags-input-render-props';

export type TagsInputAppearanceProps = {
  size?: TagsInputSizeChoice | undefined;
  variant?: TagsInputVariantChoice | undefined;
  colorPalette?: string | undefined;
  unstyled?: boolean | undefined;
  className?: string | undefined;
};
export type TagsInputRootBaseProps = UseTagsInputProps & TagsInputAppearanceProps;
export type TagsInputRootProps<As extends PrimitiveNativeTag = 'div'> = PrimitiveNativeElementProps<
  'div',
  TagsInputRootBaseProps,
  As
>;
export type TagsInputRootProviderProps<As extends PrimitiveNativeTag = 'div'> =
  PrimitiveNativeElementProps<'div', { value: UseTagsInputReturn } & TagsInputAppearanceProps, As>;

type TagsInputDefaults = Partial<TagsInputRootBaseProps>;

export interface TagsInputPropsProviderProps {
  value: TagsInputDefaults | Accessor<TagsInputDefaults>;
  children: JSX.Element;
}

const TagsInputPropsContext = createOptionalContext<Accessor<TagsInputDefaults>>();

/** Supply reactive machine and appearance defaults to descendant roots. */
export function TagsInputPropsProvider(props: TagsInputPropsProviderProps): JSX.Element {
  /** Read current defaults without taking ownership of a descendant machine. */
  function readDefaults(): TagsInputDefaults {
    return typeof props.value === 'function' ? props.value() : props.value;
  }

  return <TagsInputPropsContext value={readDefaults}>{props.children}</TagsInputPropsContext>;
}

/** Merge inherited defaults before the machine-owned root. */
export function useTagsInputRootProps(
  instance: TagsInputRenderRootProps,
): TagsInputRenderRootProps {
  const inherited = useOptionalContext(TagsInputPropsContext);
  return mergeRecipeProps<TagsInputRenderRootProps>(
    /** Follow the provider while preserving explicit root props. */
    () => inherited?.() ?? {},
    instance,
  );
}

/** Inherit appearance without replacing a caller-owned Tags Input machine. */
export function useTagsInputRootProviderProps(
  instance: TagsInputRenderProviderProps,
): TagsInputRenderProviderProps {
  const inherited = useOptionalContext(TagsInputPropsContext);
  return mergeRecipeProps<TagsInputRenderProviderProps>(
    /** Keep machine defaults off the external store. */
    () => {
      const defaults = inherited?.();
      return {
        size: defaults?.size,
        variant: defaults?.variant,
        colorPalette: defaults?.colorPalette,
        unstyled: defaults?.unstyled,
      };
    },
    instance,
  );
}
