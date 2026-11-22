import { type JSX } from '@solidjs/web';
import { type UseAvatarContext, useAvatarContext } from './use-avatar-context';

export interface AvatarContextProps {
  children: (context: UseAvatarContext) => JSX.Element;
}

/** Render the Avatar context context through a function child. */
export const AvatarContext = (props: AvatarContextProps) => props.children(useAvatarContext());
