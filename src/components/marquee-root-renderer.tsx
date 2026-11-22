import { splitProps } from '../primitives/utils/split-props';
import { Marquee as PrimitiveMarquee } from '../primitives/components/marquee';
import { createComponent, createSignal, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { MarqueeAppearanceProvider, type MarqueeAppearanceState } from './marquee-appearance';
import { MarqueeFocusBridge } from './marquee-focus-bridge';
import { useMarquee, type UseMarqueeProps } from './marquee-machine';
import type { MarqueeRuntimeProviderProps, MarqueeRuntimeRootProps } from './marquee-props';
import { marqueeRootStyle } from './marquee-root-style';

type RootInput =
  | { mode: 'root'; props: MarqueeRuntimeRootProps }
  | { mode: 'provider'; props: MarqueeRuntimeProviderProps };

/** Attach native CSS hooks around either responsive primitive Marquee root mode. */
export function renderMarqueeRoot(input: RootInput): JSX.Element {
  // A caller-rendered child may run this ref during render, so allow that write.
  const [rootNode, setRootNode] = createSignal<Element | undefined>(undefined, {
    ownedWrite: true,
  });
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );
  const [machineProps, htmlProps] = splitProps(native, [
    'autoFill',
    'defaultPaused',
    'delay',
    'id',
    'ids',
    'loopCount',
    'onComplete',
    'onLoopComplete',
    'onPauseChange',
    'paused',
    'pauseOnInteraction',
    'reverse',
    'side',
    'spacing',
    'speed',
    'translations',
    'value',
  ]);
  const machine =
    input.mode === 'root' ? useMarquee(() => machineProps as UseMarqueeProps) : input.props.value;
  const appearance: MarqueeAppearanceState = {
    /** Follow the root's changing presentation choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Retain the root for focus events and preserve the caller's ref. */
  function captureRoot(element: Element): void {
    setRootNode(element);
    if (typeof local.ref === 'function') local.ref(element);
  }

  /** Forward the root node through the primitive's child renderer. */
  function readRef(): unknown {
    return captureRoot;
  }

  const primitiveProps = mergeProps(
    /** Keep native attributes reactive without browser style generation. */
    () => htmlProps,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Supply the owned or caller-owned responsive Zag machine. */
      get value() {
        return machine;
      },
      /** Keep machine measurements beneath consumer CSS variables. */
      get style() {
        return marqueeRootStyle(machine, htmlProps);
      },
      /** Preserve caller refs on the default primitive element. */
      get ref() {
        return captureRoot;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('marquee__root', undefined, local.class, local.className);
      },
      /** Suppress authored presentation while retaining the primitive behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep the focus bridge beneath the primitive's machine context. */
      get children() {
        return <MarqueeFocusBridge root={rootNode}>{content.children}</MarqueeFocusBridge>;
      },
      /** Preserve a selected native tag or caller-rendered child. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <MarqueeAppearanceProvider value={appearance}>
      {createComponent(
        PrimitiveMarquee.RootProvider as Component<typeof primitiveProps>,
        primitiveProps,
      )}
    </MarqueeAppearanceProvider>
  );
}
