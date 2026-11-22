import { splitProps } from '../primitives/utils/split-props';
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
import { useTooltipAppearance } from './tooltip-appearance';
import { useTooltipContext } from './tooltip-machine';
import {
  tooltipPartComponents,
  tooltipPartTags,
  type TooltipPartSlot,
} from './tooltip-part-registry';
import type { ClassValue } from '../utils/class-value';

type RuntimePartProps = NativeHtmlAliases & {
  unstyled?: boolean | undefined;
  class?: ClassValue | undefined;
  className?: string | undefined;
  style?: JSX.HTMLAttributes<HTMLElement>['style'] | undefined;
  ref?: unknown | undefined;
  as?: PrimitiveNativeTag | undefined;
  asChild?: PolymorphicProps<'button'>['asChild'] | PolymorphicProps<'div'>['asChild'] | undefined;
  children?: JSX.Element | undefined;
  value?: string | undefined;
};
type TooltipPartInput = {
  [Slot in TooltipPartSlot]: {
    slot: Slot;
    props: RuntimePartProps;
    defaultChildren?: () => JSX.Element;
  };
}[TooltipPartSlot];

/** Forward a native Tooltip part while the primitive owns its behavior and presence. */
export function renderTooltipPart(input: TooltipPartInput): JSX.Element {
  const { slot, props, defaultChildren } = input;
  const appearance = useTooltipAppearance();
  let defaultChild: JSX.Element;
  let defaultChildCreated = false;
  const [content, local, native] = splitProps(
    props,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow an explicit native tag or this part's default tag. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? tooltipPartTags[slot];
  }

  /** Deliver the native node to a caller-owned callback ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const tooltip = slot === 'content' ? useTooltipContext() : undefined;

  /**
   * Zag 2.0.0-next.3 drops the content's role and id when the machine has an
   * `aria-label`, while the trigger still points `aria-describedby` at that id.
   * Restore Zag 1's labelled tooltip content until a fixed Zag prerelease.
   */
  function labelledContent(): Record<string, string | undefined> {
    const label = appearance.ariaLabel?.();
    if (!tooltip || !label) return {};
    const describedBy = tooltip().getTriggerProps()['aria-describedby'];
    return {
      role: 'tooltip',
      id: typeof describedBy === 'string' ? describedBy : undefined,
      'aria-label': label,
    };
  }

  const primitiveProps = mergeProps(
    /** Keep the primitive behavior and native attributes reactive. */
    () => native,
    /** Keep labelled content announced as the trigger's description. */
    labelledContent,
    /** Translate html-prefixed props such as htmlWidth to native attributes. */
    () => nativeHtmlAttributes(local),
    {
      /** Forward the native part ref through the primitive. */
      get ref() {
        return local.ref;
      },
      /** Compose a stable public hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(`tooltip__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress default CSS without changing the primitive behavior. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Supply the default arrow tip without replacing explicit children. */
      get children() {
        const children = content.children;
        if (children !== undefined || !defaultChildren) return children;
        if (!defaultChildCreated) {
          defaultChild = defaultChildren();
          defaultChildCreated = true;
        }
        return defaultChild;
      },
      /** Preserve caller-rendered children and native tag selection. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        if (local.as || slot === 'content') return primitiveAsChild(readTag, readRef);
        return undefined;
      },
    },
  );

  // The registry binds each public slot to its matching primitive part.
  return createComponent(
    tooltipPartComponents[slot] as Component<typeof primitiveProps>,
    primitiveProps,
  );
}
