import { splitProps } from '../primitives/utils/split-props';
import { Avatar as PrimitiveAvatar } from '../primitives/components/avatar';
import { createComponent } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useAvatarAppearance } from './avatar-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { AvatarIcon } from './avatar-icon';
import { getAvatarInitials } from './avatar-initials';
import type { AvatarFallbackProps } from './avatar-props';

/** Render custom fallback content, name initials, or the default icon. */
function AvatarFallbackImpl(props: AvatarFallbackProps): JSX.Element {
  const appearance = useAvatarAppearance();
  const [local, native] = splitProps(props, [
    'name',
    'children',
    'class',
    'className',
    'unstyled',
    'ref',
    'as',
    'asChild',
  ]);

  /** Read a selected fallback tag for the primitive's child renderer. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'span';
  }

  /** Forward a caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward native fallback attributes without its Lever UI-only name. */
    () => native,
    {
      /** Compose stable and consumer slot classes. */
      get class() {
        return composeRecipeClassNames('avatar__fallback', undefined, local.class, local.className);
      },
      /** Suppress default presentation under an unstyled root or fallback. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Forward the native fallback element to the consumer. */
      get ref() {
        return local.ref;
      },
      /** Choose fallback content after the primitive establishes its machine context. */
      get children() {
        if (local.children || local.asChild) return local.children;
        return local.name ? getAvatarInitials(local.name) : createComponent(AvatarIcon, {});
      },
      /** Preserve a caller-owned fallback or selected native tag. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'span'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(PrimitiveAvatar.Fallback, primitiveProps);
}

/** Expose selected fallback tags without runtime style props. */
export const AvatarFallback = AvatarFallbackImpl as <As extends PrimitiveNativeTag = 'span'>(
  props: AvatarFallbackProps<As>,
) => JSX.Element;
