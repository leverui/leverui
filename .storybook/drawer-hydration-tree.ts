import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  DrawerBackdrop as BackdropExport,
  DrawerCloseTrigger as CloseTriggerExport,
  DrawerContent as ContentExport,
  DrawerDescription as DescriptionExport,
  DrawerPositioner as PositionerExport,
  DrawerRoot as RootExport,
  DrawerTitle as TitleExport,
  DrawerTrigger as TriggerExport,
  Portal as PortalExport,
  DrawerOpenChangeDetails,
} from '../src';

export type DrawerHydrationComponents = {
  DrawerBackdrop: typeof BackdropExport;
  DrawerCloseTrigger: typeof CloseTriggerExport;
  DrawerContent: typeof ContentExport;
  DrawerDescription: typeof DescriptionExport;
  DrawerPositioner: typeof PositionerExport;
  DrawerRoot: typeof RootExport;
  DrawerTitle: typeof TitleExport;
  DrawerTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build the same controlled Drawer tree on the published server and client. */
export function renderDrawerHydrationTree(
  {
    DrawerBackdrop,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerDescription,
    DrawerPositioner,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
    Portal,
  }: DrawerHydrationComponents,
  initialOpen = false,
  responsive = false,
): JSX.Element {
  const [open, setOpen] = createSignal(initialOpen);

  /** Write the primitive's open change into the shared consumer signal. */
  function updateOpen(details: DrawerOpenChangeDetails): void {
    setOpen(details.open);
  }

  return createComponent(DrawerRoot, {
    /** Follow the controlled signal after the trigger opens the Drawer. */
    get open() {
      return open();
    },
    onOpenChange: updateOpen,
    /** Keep the server and client on the same finite size selectors. */
    get size() {
      return responsive ? ({ mdDown: 'full', md: 'lg' } as const) : undefined;
    },
    /** Keep the responsive edge reactive through hydration. */
    get placement() {
      return responsive ? ({ mdDown: 'bottom', md: 'end' } as const) : 'end';
    },
    /** Create the trigger and portalled content beneath the primitive's provider. */
    get children() {
      return [
        createComponent(DrawerTrigger, {
          'data-testid': 'hydrated-drawer-trigger',
          children: 'Open hydrated drawer',
        }),
        createComponent(Portal, {
          /** Render the overlay in the browser portal after it opens. */
          get children() {
            return [
              createComponent(DrawerBackdrop, { id: 'hydrated-drawer-backdrop' }),
              createComponent(DrawerPositioner, {
                /** Keep content under the primitive's positioner and presence. */
                get children() {
                  return createComponent(DrawerContent, {
                    'data-testid': 'hydrated-drawer-content',
                    /** Preserve title, description, and close relationships. */
                    get children() {
                      return [
                        createComponent(DrawerTitle, { children: 'Hydrated drawer title' }),
                        createComponent(DrawerDescription, {
                          children: 'Hydrated drawer description',
                        }),
                        createComponent(Dynamic, {
                          component: 'input',
                          'aria-label': 'Hydrated drawer input',
                        }),
                        createComponent(DrawerCloseTrigger, {
                          children: 'Close hydrated drawer',
                        }),
                      ];
                    },
                  });
                },
              }),
            ];
          },
        }),
      ];
    },
  });
}
