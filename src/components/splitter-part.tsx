import { splitProps } from '../primitives/utils/split-props';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useSplitterAppearance } from './splitter-appearance';
import type { SplitterRuntimePartProps } from './splitter-props';

type SplitterPartSlot = 'panel' | 'resizeTrigger' | 'resizeTriggerIndicator';

/** Forward one native Splitter part while the primitive owns resize behavior. */
export function renderSplitterPart<PrimitiveProps extends object, Tag extends 'div' | 'button'>(
  primitivePart: Component<PrimitiveProps>,
  slot: SplitterPartSlot,
  tag: Tag,
  props: SplitterRuntimePartProps<Tag>,
  defaultChildren?: () => JSX.Element,
): JSX.Element {
  const appearance = useSplitterAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native part tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? tag;
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine and native attributes reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Compose the public part hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          `splitter__${slot}`,
          undefined,
          local.class,
          local.className,
        );
      },
      /** Forward the native part element to its consumer. */
      get ref() {
        return local.ref;
      },
      /** Suppress default CSS without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild(): PolymorphicProps<Tag>['asChild'] {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<Tag>(readTag, readRef) : undefined;
      },
      /** Evaluate default handle parts after the primitive creates its context. */
      get children() {
        return content.children ?? defaultChildren?.();
      },
    },
  );

  // The primitive declares parts separately; the adapter preserves each part's runtime props.
  return createComponent(primitivePart as Component<typeof primitiveProps>, primitiveProps);
}
