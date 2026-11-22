import { splitProps } from '../primitives/utils/split-props';
import { SegmentGroup as PrimitiveSegmentGroup } from '../primitives/components/segment-group';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import {
  SegmentGroupAppearanceProvider,
  type SegmentGroupAppearanceState,
} from './segment-group-appearance';
import { segmentGroupAttributes } from './segment-group-attributes';
import {
  useSegmentGroupRootProps,
  useSegmentGroupRootProviderProps,
  type SegmentGroupRootProps,
  type SegmentGroupRootProviderProps,
  type SegmentGroupRuntimeProviderProps,
  type SegmentGroupRuntimeRootProps,
} from './segment-group-props';

type RootInput =
  | { mode: 'root'; props: SegmentGroupRuntimeRootProps }
  | { mode: 'provider'; props: SegmentGroupRuntimeProviderProps };

/** Bind authored CSS hooks around either primitive Segment Group root mode. */
function renderSegmentGroupRoot(
  input: RootInput,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const part =
    input.mode === 'root' ? PrimitiveSegmentGroup.Root : PrimitiveSegmentGroup.RootProvider;
  const [local, native] = splitProps(input.props, [
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const appearance: SegmentGroupAppearanceState = {
    /** Follow the root's changing unstyled selection. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a caller-selected native root tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? 'div';
  }

  /** Forward the caller ref through the primitive child composition. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve machine options and native attributes reactively. */
    () => native,
    /** Convert html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    /** Expose finite CSS choices without inserted styles. */
    () => segmentGroupAttributes(local),
    {
      /** Forward the caller ref to the selected native element. */
      get ref() {
        return local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'segment-group__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Resolve children beneath the primitive's radio context. */
      get children() {
        return content.children;
      },
      /** Select a native tag or caller-rendered child through the primitive. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <SegmentGroupAppearanceProvider value={appearance}>
      {createComponent(part as Component<typeof primitiveProps>, primitiveProps)}
    </SegmentGroupAppearanceProvider>
  );
}

/** Render a Segment Group with its own primitive and Zag radio machine. */
function SegmentGroupRootImpl(props: SegmentGroupRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useSegmentGroupRootProps(instance);
  const oriented = mergeProps({ orientation: 'horizontal' as const }, merged);
  return renderSegmentGroupRoot({ mode: 'root', props: oriented }, content);
}

/** Expose native, selected-tag, and caller-owned Segment Group roots. */
export const SegmentGroupRoot = SegmentGroupRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: SegmentGroupRootProps<As>,
) => JSX.Element;

/** Render a Segment Group around a caller-owned primitive machine. */
function SegmentGroupRootProviderImpl(props: SegmentGroupRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderSegmentGroupRoot(
    { mode: 'provider', props: useSegmentGroupRootProviderProps(instance) },
    content,
  );
}

/** Require an external radio machine on provider roots. */
export const SegmentGroupRootProvider = SegmentGroupRootProviderImpl as <
  As extends PrimitiveNativeTag = 'div',
>(
  props: SegmentGroupRootProviderProps<As>,
) => JSX.Element;
