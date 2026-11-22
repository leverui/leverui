import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useAvatarProps, type AvatarRootProps } from './avatar-props';
import { renderAvatarRoot } from './avatar-root-presentation';
import type { AvatarRuntimeRootProps } from './avatar-runtime-props';

/** Render the primitive's Avatar machine with authored root and part hooks. */
function AvatarRootImpl(props: AvatarRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderAvatarRoot('root', useAvatarProps(instance), content);
}

/** Expose native tag and child paths without object-style props. */
export const AvatarRoot = AvatarRootImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: AvatarRootProps<As>,
) => JSX.Element;
