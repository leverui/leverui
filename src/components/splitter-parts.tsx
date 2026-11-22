import { splitProps } from '../primitives/utils/split-props';
import { primitive } from '../primitives/components/factory';
import { Splitter as PrimitiveSplitter } from '../primitives/components/splitter';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderSplitterPart } from './splitter-part';
import { useSplitterAppearance } from './splitter-appearance';
import type {
  SplitterPanelProps,
  SplitterResizeTriggerIndicatorProps,
  SplitterResizeTriggerProps,
  SplitterResizeTriggerSeparatorProps,
  SplitterRuntimePartProps,
} from './splitter-props';
import type {
  SplitterPanelMachineProps,
  SplitterResizeTriggerMachineProps,
} from './splitter-types';

/** Render a panel registered with the primitive's splitter machine. */
function SplitterPanelImpl(
  props: SplitterRuntimePartProps<'div'> & SplitterPanelMachineProps,
): JSX.Element {
  return renderSplitterPart(PrimitiveSplitter.Panel, 'panel', 'div', props);
}

/** Expose native, selected-tag, and child Splitter panels. */
export const SplitterPanel = SplitterPanelImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: SplitterPanelProps<As>,
) => JSX.Element;

/** Render a focusable handle with the separator role and indicator. */
function SplitterResizeTriggerImpl(
  props: SplitterRuntimePartProps<'button'> & SplitterResizeTriggerMachineProps,
): JSX.Element {
  const labeled = mergeProps(props, {
    /** Supply a default label unless the consumer names the separator. */
    get 'aria-label'() {
      return props['aria-label'] ?? 'Resize';
    },
  });
  return renderSplitterPart(
    PrimitiveSplitter.ResizeTrigger,
    'resizeTrigger',
    'button',
    labeled,
    /** Render the default handle parts when children are absent. */
    () => (
      <>
        <SplitterResizeTriggerSeparator />
        <SplitterResizeTriggerIndicator />
      </>
    ),
  );
}

/** Expose native, selected-tag, and child resize triggers. */
export const SplitterResizeTrigger = SplitterResizeTriggerImpl as <
  As extends PrimitiveNativeTag = 'button',
>(
  props: SplitterResizeTriggerProps<As>,
) => JSX.Element;

/** Render the separator line inside a resize trigger. */
function SplitterResizeTriggerSeparatorImpl(props: SplitterRuntimePartProps<'div'>): JSX.Element {
  const appearance = useSplitterAppearance();
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow a caller-selected native separator tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the separator ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native attributes without browser style generation. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Combine the public separator hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'splitter__resizeTriggerSeparator',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Keep the caller's native separator ref. */
      get ref() {
        return local.ref;
      },
      /** Suppress default presentation without changing the handle. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Preserve a selected native tag or caller-rendered child. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
      /** Keep nested separator content inside the trigger. */
      get children() {
        return content.children;
      },
    },
  );

  return createComponent(primitive.div as Component<typeof primitiveProps>, primitiveProps);
}

/** Expose native, selected-tag, and child separator lines. */
export const SplitterResizeTriggerSeparator = SplitterResizeTriggerSeparatorImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: SplitterResizeTriggerSeparatorProps<As>,
) => JSX.Element;

/** Render the primitive's orientation-aware resize handle indicator. */
function SplitterResizeTriggerIndicatorImpl(props: SplitterRuntimePartProps<'div'>): JSX.Element {
  return renderSplitterPart(
    PrimitiveSplitter.ResizeTriggerIndicator,
    'resizeTriggerIndicator',
    'div',
    props,
  );
}

/** Expose native, selected-tag, and child handle indicators. */
export const SplitterResizeTriggerIndicator = SplitterResizeTriggerIndicatorImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: SplitterResizeTriggerIndicatorProps<As>,
) => JSX.Element;
