import { splitProps } from '../primitives/utils/split-props';
import { Avatar as PrimitiveAvatar } from '../primitives/components/avatar';
import { createComponent } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { useAvatarAppearance } from './avatar-appearance';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import type { AvatarImageProps } from './avatar-props';

/** Render the primitive's status-aware image with a stable authored CSS hook. */
function AvatarImageImpl(props: AvatarImageProps): JSX.Element {
  const appearance = useAvatarAppearance();
  const [local, native] = splitProps(props, [
    'class',
    'className',
    'unstyled',
    'ref',
    'as',
    'asChild',
  ]);

  /** Read the selected native image tag for the primitive's child renderer. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'img';
  }

  /** Forward a caller ref through the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Forward changing image and native attributes to the primitive. */
    () => native,
    {
      /** Keep the default image attributes unless the consumer overrides them. */
      get draggable() {
        return native.draggable ?? 'false';
      },
      /** Avoid leaking a user's referrer for an Avatar image by default. */
      get referrerpolicy() {
        return native.referrerpolicy ?? 'no-referrer';
      },
      /** Include the stable image hook and consumer classes. */
      get class() {
        return composeRecipeClassNames('avatar__image', undefined, local.class, local.className);
      },
      /** Suppress default presentation under an unstyled root or image. */
      get 'data-unstyled'() {
        return local.unstyled || appearance.unstyled() ? '' : undefined;
      },
      /** Forward the native image element to the consumer. */
      get ref() {
        return local.ref;
      },
      /** Preserve a caller-owned image or selected native tag. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'img'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(PrimitiveAvatar.Image, primitiveProps);
}

/** Expose selected native image tags without runtime style props. */
export const AvatarImage = AvatarImageImpl as <As extends PrimitiveNativeTag = 'img'>(
  props: AvatarImageProps<As>,
) => JSX.Element;
