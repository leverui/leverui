import type {
  Api as AvatarApi,
  Props as AvatarMachineProps,
  StatusChangeDetails,
} from '@zag-js/avatar';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type AvatarStatusChangeDetails = StatusChangeDetails;
export type UseAvatarProps = Omit<AvatarMachineProps, 'dir' | 'getRootNode' | 'id'> & {
  id?: string;
};
export type UseAvatarReturn = Accessor<AvatarApi<PropTypes>>;
export type UseAvatarContext = UseAvatarReturn;

export interface AvatarContextProps {
  children: (context: UseAvatarContext) => JSX.Element;
}
