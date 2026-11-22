import { splitProps } from '../primitives/utils/split-props';
import { Switch as PrimitiveSwitch } from '../primitives/components/switch';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { SwitchAppearanceProvider, type SwitchAppearanceState } from './switch-appearance';
import { switchAttributes } from './switch-choices';
import {
  useSwitchRootProps,
  useSwitchRootProviderProps,
  type SwitchRootProps,
  type SwitchRootProviderProps,
  type SwitchRuntimeProviderProps,
  type SwitchRuntimeRootProps,
} from './switch-props';

type RootRenderInput =
  | { mode: 'root'; props: SwitchRuntimeRootProps }
  | { mode: 'provider'; props: SwitchRuntimeProviderProps };

/** Bind native CSS hooks around either primitive Switch machine root. */
function renderSwitchRoot(input: RootRenderInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveSwitch.Root : PrimitiveSwitch.RootProvider;
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
  const appearance: SwitchAppearanceState = {
    /** Follow the root's changing unstyled choice. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'label';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep machine options and native attributes reactive. */
    () => native,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite appearance choices without browser style generation. */
    () => switchAttributes(local),
    {
      /** Forward a native ref to the selected root element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('switch__root', undefined, local.class, local.className);
      },
      /** Keep compound parts beneath the primitive and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'label'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <SwitchAppearanceProvider value={appearance}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </SwitchAppearanceProvider>
  );
}

/** Render a Switch with its own primitive and Zag machine. */
function SwitchRootImpl(props: SwitchRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSwitchRootProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the current machine context. */
    get children() {
      return content.children;
    },
  });
  return renderSwitchRoot({ mode: 'root', props: forwarded });
}

/** Expose a typed Switch root with caller-owned element selection. */
export const SwitchRoot = SwitchRootImpl as <As extends PrimitiveNativeTag = 'label'>(
  props: SwitchRootProps<As>,
) => JSX.Element;

/** Render a Switch driven by a caller-owned primitive machine accessor. */
function SwitchRootProviderImpl(props: SwitchRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSwitchRootProviderProps(instance);
  const forwarded = mergeProps(merged, {
    /** Keep child parts inside the supplied machine context. */
    get children() {
      return content.children;
    },
  });
  return renderSwitchRoot({ mode: 'provider', props: forwarded });
}

/** Expose a typed external-machine Switch root. */
export const SwitchRootProvider = SwitchRootProviderImpl as <
  As extends PrimitiveNativeTag = 'label',
>(
  props: SwitchRootProviderProps<As>,
) => JSX.Element;
