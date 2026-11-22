import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  PopoverArrow as ArrowExport,
  PopoverCloseTrigger as CloseTriggerExport,
  PopoverContent as ContentExport,
  PopoverPositioner as PositionerExport,
  PopoverRoot as RootExport,
  PopoverTitle as TitleExport,
  PopoverTrigger as TriggerExport,
  Portal as PortalExport,
} from '../src';

export type PopoverHydrationComponents = {
  PopoverArrow: typeof ArrowExport;
  PopoverCloseTrigger: typeof CloseTriggerExport;
  PopoverContent: typeof ContentExport;
  PopoverPositioner: typeof PositionerExport;
  PopoverRoot: typeof RootExport;
  PopoverTitle: typeof TitleExport;
  PopoverTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build the same Popover tree for published SSR and client hydration. */
export function renderPopoverHydrationTree(
  {
    PopoverArrow,
    PopoverCloseTrigger,
    PopoverContent,
    PopoverPositioner,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
    Portal,
  }: PopoverHydrationComponents,
  initialOpen = false,
): JSX.Element {
  return createComponent(PopoverRoot, {
    defaultOpen: initialOpen,
    lazyMount: true,
    unmountOnExit: true,
    /** Keep the trigger and portal under one primitive Popover machine. */
    get children() {
      return [
        createComponent(PopoverTrigger, {
          'data-testid': 'hydrated-popover-trigger',
          children: 'Open hydrated popover',
        }),
        createComponent(Portal, {
          /** Move the surface into a browser portal during hydration. */
          get children() {
            return createComponent(PopoverPositioner, {
              /** Keep the surface under the primitive's presence context. */
              get children() {
                return createComponent(PopoverContent, {
                  'data-testid': 'hydrated-popover-content',
                  /** Render an accessible title and a working close control. */
                  get children() {
                    return [
                      createComponent(PopoverArrow, {}),
                      createComponent(PopoverTitle, { children: 'Hydrated details' }),
                      createComponent(PopoverCloseTrigger, {
                        'data-testid': 'hydrated-popover-close',
                        children: 'Close hydrated details',
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
