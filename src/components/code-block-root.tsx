import { splitProps } from '../primitives/utils/split-props';
import { primitive } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { codeBlockSizeAttributes, CodeBlockAppearanceProvider } from './code-block-appearance';
import {
  useCodeBlockProps,
  type CodeBlockRootProps,
  type CodeBlockRootInstanceProps,
} from './code-block-props';
import { useCodeBlockRootState } from './code-block-root-state';
import { CodeBlockStateProvider } from './code-block-state';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';

/** Compose Code Block behavior and finite CSS attributes on a native root. */
export function CodeBlockRoot<As extends PrimitiveNativeTag = 'div'>(
  props: CodeBlockRootProps<As>,
): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useCodeBlockProps(instance as CodeBlockRootInstanceProps);
  const [local, nativeProps] = splitProps(merged, [
    'code',
    'language',
    'meta',
    'maxLines',
    'contentId',
    'defaultColorScheme',
    'copyTimeout',
    'onCopy',
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const state = useCodeBlockRootState(local);

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Expose the caller's ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }
  const rootProps = mergeProps(
    /** Forward native attributes, callbacks, refs, and element selection. */
    () => nativeProps,
    /** Keep responsive size selectors live as provider defaults change. */
    () => codeBlockSizeAttributes(local.size),
    {
      /** Preserve a caller-owned native ref. */
      get ref() {
        return local.ref;
      },
      /** Select a native root or render into the caller's child. */
      get asChild() {
        const child = local.asChild;
        if (child) return primitiveChildWithRef(child, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
      /** Keep the public hook alongside consumer classes. */
      get class() {
        return composeRecipeClassNames('code-block__root', undefined, local.class, local.className);
      },
      /** Suppress authored root and descendant presentation. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Scope syntax tokens to the requested mode. */
      get 'data-leverui-color-mode'() {
        return state.meta().colorScheme;
      },
      /** Establish a closest-scope token boundary for this block. */
      'data-leverui-theme': '',
      /** Reflect focused-line state for consumer selectors. */
      get 'data-has-focused'() {
        return state.meta().focusedLineNumbers?.length ? '' : undefined;
      },
      /** Reflect diff state for consumer selectors. */
      get 'data-has-diff'() {
        return state.meta().addedLineNumbers?.length || state.meta().removedLineNumbers?.length
          ? ''
          : undefined;
      },
      /** Reflect line-number state for consumer selectors. */
      get 'data-has-line-numbers'() {
        return state.meta().showLineNumbers ? '' : undefined;
      },
      /** Construct all compound parts beneath the native root. */
      get children() {
        return content.children;
      },
    },
  );

  return createComponent(CodeBlockStateProvider, {
    value: state,
    /** Scope part appearance to this instance. */
    get children() {
      return createComponent(CodeBlockAppearanceProvider, {
        value: {
          /** Follow the root's current unstyled choice. */
          unstyled: () => Boolean(local.unstyled),
        },
        /** Preserve one root element through reactive updates. */
        get children() {
          return createComponent(primitive.div as Component<typeof rootProps>, rootProps);
        },
      });
    },
  });
}
