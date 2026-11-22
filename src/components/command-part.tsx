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
import { commandAppearanceAttributes, useCommandAppearance } from './command-appearance';
import {
  commandPartComponents,
  commandPartTags,
  type CommandPartSlot,
} from './command-part-registry';
import type { ClassValue } from '../utils/class-value';

/** Props handled by the shared Command part rendering boundary. */
export type CommandPartRuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> &
  NativeHtmlAliases & {
    unstyled?: boolean | undefined;
    class?: ClassValue | undefined;
    className?: string | undefined;
    ref?: unknown | undefined;
    as?: PrimitiveNativeTag | undefined;
    asChild?: PolymorphicProps<'div'>['asChild'] | undefined;
  };

const plainPartNames: Partial<Record<CommandPartSlot, string>> = {
  indicator: 'indicator',
  itemCommand: 'item-command',
  loading: 'loading',
  separator: 'separator',
  footer: 'footer',
};

/** Forward one native Command part while the primitive retains interaction behavior. */
export function renderCommandPart(slot: CommandPartSlot, props: unknown): JSX.Element {
  // Public part signatures validate the props before this mixed primitive registry.
  const runtime = props as CommandPartRuntimeProps;
  const part = commandPartComponents[slot] as Component<object>;
  const appearance = useCommandAppearance();
  const [children, local, native] = splitProps(
    runtime,
    ['children'],
    ['unstyled', 'class', 'className', 'ref', 'as', 'asChild', ...nativeHtmlAliasNames],
  );

  /** Follow the caller's native tag or this part's default. */
  function readTag(): PrimitiveNativeTag {
    return local.as ?? commandPartTags[slot];
  }

  /** Retain callback and object refs through the primitive's child adapter. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive and native attributes without style extraction. */
    () => native,
    /** Translate native aliases at the element boundary. */
    () => nativeHtmlAttributes(local),
    /** Keep finite size and palette selectors on every part. */
    () => commandAppearanceAttributes(appearance),
    /** Name Lever-owned parts the way the primitive names its own, such as `data-command-footer`. */
    plainPartNames[slot] ? { [`data-command-${plainPartNames[slot]}`]: '' } : {},
    {
      /** Preserve the caller ref on the default primitive element. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable Command part hook with caller classes. */
      get class() {
        return composeRecipeClassNames(`command__${slot}`, undefined, local.class, local.className);
      },
      /** Suppress authored presentation for this part or its root. */
      get 'data-unstyled'() {
        return appearance.unstyled() || local.unstyled ? '' : undefined;
      },
      /** Keep polymorphic native tags and caller-owned children. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild(readTag, readRef) : undefined;
      },
    },
    children,
  );

  return createComponent(part, primitiveProps);
}
