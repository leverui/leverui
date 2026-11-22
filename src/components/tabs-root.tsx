import { splitProps } from '../primitives/utils/split-props';
import { Tabs as PrimitiveTabs } from '../primitives/components/tabs';
import type { PolymorphicProps } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import {
  nativeHtmlAliasNames,
  nativeHtmlAttributes,
  type NativeHtmlAliases,
} from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { TabsAppearance } from './tabs-appearance';
import { tabsLayoutAttributes } from './tabs-layout';
import { tabsSizeAttributes } from './tabs-size';
import { tabsVariantAttributes } from './tabs-variant';
import type { UseTabsReturn } from './tabs-machine';
import {
  useTabsRootProps,
  useTabsRootProviderProps,
  type TabsRootProps,
  type TabsRootProviderProps,
} from './tabs-props';

type RuntimeRootProps = JSX.HTMLAttributes<HTMLDivElement> &
  NativeHtmlAliases &
  TabsAppearance & {
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
    children?: JSX.Element | undefined;
  };
type RuntimeProviderProps = RuntimeRootProps & { value: UseTabsReturn };
type RootInput =
  { mode: 'root'; props: RuntimeRootProps } | { mode: 'provider'; props: RuntimeProviderProps };

/** Render an owned or caller-owned primitive Tabs machine with authored CSS hooks. */
function renderTabsRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const { mode, props } = input;
  const part = mode === 'root' ? PrimitiveTabs.Root : PrimitiveTabs.RootProvider;
  const [local, rest] = splitProps(props, [
    'size',
    'variant',
    'fitted',
    'justify',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow a caller-selected native root element. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller's root ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward live machine, presence, and native attributes. */
    () => rest,
    /** Translate native HTML aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    /** Select finite size and spacing at supported breakpoints. */
    () => tabsSizeAttributes(local.size),
    /** Select finite fitted and alignment rules at supported breakpoints. */
    () => tabsLayoutAttributes(local.fitted, local.justify),
    /** Select all five finite variants at supported breakpoints. */
    () => tabsVariantAttributes(local.variant),
    {
      /** Preserve the caller's native root ref. */
      get ref() {
        return local.ref;
      },
      /** Keep the public root hook and caller classes. */
      get class() {
        return composeRecipeClassNames('tabs__root', undefined, local.class, local.className);
      },
      /** Scope palette variables to this root's authored styles. */
      get 'data-leverui-color-palette'() {
        return local.colorPalette;
      },
      /** Suppress authored presentation for an unstyled root. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep descendants inside the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Preserve selected tags and caller-owned child renderers. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
  );
  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Create a Tabs machine and render its native root. */
function TabsRootImpl(props: RuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderTabsRoot({ mode: 'root', props: useTabsRootProps(instance) }, content);
}

/** Expose typed Tabs root props for each native element choice. */
export const TabsRoot = TabsRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: TabsRootProps<As>,
) => JSX.Element;

/** Render a Tabs root around a caller-owned primitive accessor. */
function TabsRootProviderImpl(props: RuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderTabsRoot({ mode: 'provider', props: useTabsRootProviderProps(instance) }, content);
}

/** Expose typed provider props without creating another machine. */
export const TabsRootProvider = TabsRootProviderImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: TabsRootProviderProps<As>,
) => JSX.Element;
