import { splitProps } from '../primitives/utils/split-props';
import { TagsInput as PrimitiveTagsInput } from '../primitives/components/tags-input';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { tagsInputAppearanceAttributes } from './tags-input-appearance';
import {
  useTagsInputRootProps,
  useTagsInputRootProviderProps,
  type TagsInputRootProps,
  type TagsInputRootProviderProps,
} from './tags-input-props';
import type {
  TagsInputRenderProviderProps,
  TagsInputRenderRootProps,
} from './tags-input-render-props';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';

type RootInput =
  | { mode: 'root'; props: TagsInputRenderRootProps }
  | { mode: 'provider'; props: TagsInputRenderProviderProps };

/** Bind either primitive root to native attributes and authored CSS hooks. */
function renderTagsInputRoot(input: RootInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveTagsInput.Root : PrimitiveTagsInput.RootProvider;
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    [
      'size',
      'variant',
      'colorPalette',
      'unstyled',
      'class',
      'className',
      'ref',
      'as',
      'asChild',
      ...nativeHtmlAliasNames,
    ],
  );

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the current root ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve current machine options and native attributes. */
    () => native,
    /** Translate supported native aliases at the rendered root. */
    () => nativeHtmlAttributes(local),
    /** Select finite CSS rules without generating a stylesheet. */
    () => tagsInputAppearanceAttributes(local.size, local.variant),
    {
      /** Preserve refs on the default native root. */
      get ref() {
        return local.ref;
      },
      /** Keep the stable root hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('tags-input__root', undefined, local.class, local.className);
      },
      /** Bind the requested semantic palette to every visible part. */
      get 'data-lui-color-palette'() {
        return local.colorPalette;
      },
      /** Suppress default presentation while retaining machine semantics. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep public parts within the primitive machine context. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected native elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Render a Tags Input with a locally owned primitive machine. */
function TagsInputRootImpl(props: TagsInputRenderRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useTagsInputRootProps(instance);
  const rootProps = mergeProps({ editable: false }, merged, content);
  return renderTagsInputRoot({ mode: 'root', props: rootProps });
}

/** Expose native root props with finite appearance choices. */
export const TagsInputRoot = TagsInputRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: TagsInputRootProps<As>,
) => JSX.Element;

/** Render a Tags Input around a caller-owned primitive machine. */
function TagsInputRootProviderImpl(props: TagsInputRenderProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useTagsInputRootProviderProps(instance);
  const rootProps = mergeProps(merged, content);
  return renderTagsInputRoot({ mode: 'provider', props: rootProps });
}

/** Require the caller's machine accessor on provider roots. */
export const TagsInputRootProvider = TagsInputRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: TagsInputRootProviderProps<As>,
) => JSX.Element;
