import { splitProps } from '../primitives/utils/split-props';
import { Avatar as PrimitiveAvatar } from '../primitives/components/avatar';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import {
  AvatarAppearanceProvider,
  avatarAppearanceAttributes,
  type AvatarAppearanceState,
} from './avatar-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { AvatarRuntimeProviderProps, AvatarRuntimeRootProps } from './avatar-runtime-props';

const roots = { root: PrimitiveAvatar.Root, provider: PrimitiveAvatar.RootProvider } as const;
type AvatarRootMode = keyof typeof roots;
type RuntimeRoot = AvatarRuntimeRootProps | AvatarRuntimeProviderProps;

/** Attach authored appearance hooks around either primitive Avatar root mode. */
export function renderAvatarRoot(
  mode: AvatarRootMode,
  props: RuntimeRoot,
  content: { readonly children?: JSX.Element },
): JSX.Element {
  const [local, native] = splitProps(props, [
    'size',
    'variant',
    'shape',
    'borderless',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
  ]);
  const attributes = createMemo(
    /** Follow provider defaults and local appearance changes reactively. */
    () => avatarAppearanceAttributes(local),
  );
  const appearance: AvatarAppearanceState = {
    /** Let every part suppress its own default CSS under an unstyled root. */
    unstyled: () => Boolean(local.unstyled),
  };

  /** Follow a selected native tag without remounting the Avatar machine. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Give the primitive the caller's current ref for child rendering. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Keep native and machine attributes live. */
    () => native,
    /** Expose validated finite choices to authored CSS. */
    () => attributes(),
    {
      /** Preserve the native root ref. */
      get ref() {
        return local.ref;
      },
      /** Keep the public root hook alongside caller classes. */
      get class() {
        return composeRecipeClassNames('avatar__root', undefined, local.class, local.className);
      },
      /** Build parts inside the primitive's machine and appearance contexts. */
      get children() {
        return content.children;
      },
      /** Render the caller's element, or Lever's `div` default where the primitive uses a `span`. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return primitiveAsChild<'div'>(readTag, readRef);
      },
    },
  );

  return (
    <AvatarAppearanceProvider value={appearance}>
      {/* The primitive's two root signatures meet at the native element boundary. */}
      {createComponent(roots[mode] as Component<typeof primitiveProps>, primitiveProps)}
    </AvatarAppearanceProvider>
  );
}
