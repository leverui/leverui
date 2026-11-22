import {
  AvatarContext as PrimitiveContext,
  useAvatar as usePrimitiveAvatar,
  useAvatarContext as usePrimitiveAvatarContext,
} from '../primitives/components/avatar';
import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  AvatarContextProps,
  UseAvatarContext,
  UseAvatarProps,
  UseAvatarReturn,
} from './avatar-types';

/** Create the primitive's Zag Avatar machine behind a stable Lever UI type contract. */
export function useAvatar(props?: UseAvatarProps | Accessor<UseAvatarProps>): UseAvatarReturn {
  return usePrimitiveAvatar(props);
}

/** Read the nearest primitive Avatar machine as a Solid accessor. */
export function useAvatarContext(): UseAvatarContext {
  return usePrimitiveAvatarContext();
}

/** Supply the Avatar machine accessor to a child render callback. */
export function AvatarContext(props: AvatarContextProps): JSX.Element {
  return createComponent(PrimitiveContext, props);
}
