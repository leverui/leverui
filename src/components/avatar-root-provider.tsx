import { splitProps } from '../primitives/utils/split-props';
import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { useAvatarRootProviderProps, type AvatarRootProviderProps } from './avatar-props';
import { renderAvatarRoot } from './avatar-root-presentation';
import type { AvatarRuntimeProviderProps } from './avatar-runtime-props';

/** Render an Avatar driven by a caller-owned primitive machine accessor. */
function AvatarRootProviderImpl(props: AvatarRuntimeProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderAvatarRoot('provider', useAvatarRootProviderProps(instance), content);
}

/** Require an external machine while retaining native appearance hooks. */
export const AvatarRootProvider = AvatarRootProviderImpl as <As extends PrimitiveNativeTag = 'div'>(
  props: AvatarRootProviderProps<As>,
) => JSX.Element;
