import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Portal as PortalExport,
  TooltipContent as ContentExport,
  TooltipPositioner as PositionerExport,
  TooltipRoot as RootExport,
  TooltipTrigger as TriggerExport,
} from '../src';

export type TooltipHydrationComponents = {
  Portal: typeof PortalExport;
  TooltipContent: typeof ContentExport;
  TooltipPositioner: typeof PositionerExport;
  TooltipRoot: typeof RootExport;
  TooltipTrigger: typeof TriggerExport;
};

/** Build the same Tooltip tree for published SSR and client hydration. */
export function renderTooltipHydrationTree(
  {
    Portal,
    TooltipContent,
    TooltipPositioner,
    TooltipRoot,
    TooltipTrigger,
  }: TooltipHydrationComponents,
  initialOpen: boolean,
): JSX.Element {
  return createComponent(TooltipRoot, {
    defaultOpen: initialOpen,
    openDelay: 0,
    closeDelay: 0,
    /** Keep the trigger and portalled surface under one machine. */
    get children() {
      return [
        createComponent(TooltipTrigger, {
          'data-testid': 'hydrated-tooltip-trigger',
          children: 'Hydrated tooltip',
        }),
        createComponent(Portal, {
          /** Move the surface into a browser portal during hydration. */
          get children() {
            return createComponent(TooltipPositioner, {
              /** Keep content under the primitive's presence context. */
              get children() {
                return createComponent(TooltipContent, {
                  'data-testid': 'hydrated-tooltip-content',
                  children: 'Hydrated details',
                });
              },
            });
          },
        }),
      ];
    },
  });
}
