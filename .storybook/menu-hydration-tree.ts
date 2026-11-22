import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  MenuArrow as ArrowExport,
  MenuContent as ContentExport,
  MenuItem as ItemExport,
  MenuPositioner as PositionerExport,
  MenuRoot as RootExport,
  MenuTrigger as TriggerExport,
  Portal as PortalExport,
} from '../src';

export type MenuHydrationComponents = {
  MenuArrow: typeof ArrowExport;
  MenuContent: typeof ContentExport;
  MenuItem: typeof ItemExport;
  MenuPositioner: typeof PositionerExport;
  MenuRoot: typeof RootExport;
  MenuTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build the same menu tree for published SSR and client hydration. */
export function renderMenuHydrationTree(
  {
    MenuArrow,
    MenuContent,
    MenuItem,
    MenuPositioner,
    MenuRoot,
    MenuTrigger,
    Portal,
  }: MenuHydrationComponents,
  initialOpen = false,
): JSX.Element {
  return createComponent(MenuRoot, {
    defaultOpen: initialOpen,
    lazyMount: true,
    unmountOnExit: true,
    /** Keep the trigger and portal under one primitive menu machine. */
    get children() {
      return [
        createComponent(MenuTrigger, {
          'data-testid': 'hydrated-menu-trigger',
          children: 'Open hydrated menu',
        }),
        createComponent(Portal, {
          /** Move the surface into a browser portal during hydration. */
          get children() {
            return createComponent(MenuPositioner, {
              /** Keep the surface under the primitive's presence context. */
              get children() {
                return createComponent(MenuContent, {
                  'data-testid': 'hydrated-menu-content',
                  /** Render a default arrow and actionable item. */
                  get children() {
                    return [
                      createComponent(MenuArrow, {}),
                      createComponent(MenuItem, {
                        value: 'save',
                        'data-testid': 'hydrated-menu-item',
                        children: 'Save hydrated file',
                      }),
                    ];
                  },
                });
              },
            });
          },
        }),
      ];
    },
  });
}
