import { mergeProps } from '../../utils/merge-part-props';
import { createEffect } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseMenuReturn } from './use-menu';
import { MenuProvider, useMenuContext } from './use-menu-context';
import { MenuMachineProvider, useMenuMachineContext } from './use-menu-machine-context';
import { MenuTriggerItemProvider } from './use-menu-trigger-item-context';

interface RootProviderProps {
  value: UseMenuReturn;
}

export type MenuRootProviderBaseProps = RootProviderProps & UsePresenceProps;
export interface MenuRootProviderProps extends MenuRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the Menu root provider to its children. */
export const MenuRootProvider = (props: MenuRootProviderProps) => {
  const parentApi = useMenuContext();
  const parentMachine = useMenuMachineContext();
  const [presenceProps, menuProps] = splitPresenceProps(props);
  const presenceApi = usePresence(
    mergeProps(presenceProps, () => ({ present: menuProps.value.api().open })),
  );

  createEffect(
    () => ({ parent: parentApi?.(), api: menuProps.value.api(), service: menuProps.value.service }),
    ({ parent, api, service }) => {
      if (!parentMachine) return;
      parent?.setChild(service);
      api.setParent(parentMachine);
    },
  );

  /** Trigger item context. */
  const triggerItemContext = () => parentApi?.().getTriggerItemProps(menuProps.value.api());

  return (
    <MenuTriggerItemProvider value={triggerItemContext}>
      <MenuMachineProvider value={menuProps.value.service}>
        <MenuProvider value={menuProps.value.api}>
          <PresenceProvider value={presenceApi}>{menuProps.children}</PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  );
};
