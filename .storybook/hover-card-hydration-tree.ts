import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  HoverCardArrow as ArrowExport,
  HoverCardContent as ContentExport,
  HoverCardPositioner as PositionerExport,
  HoverCardRoot as RootExport,
  HoverCardTrigger as TriggerExport,
  Portal as PortalExport,
} from '../src';

export type HoverCardHydrationComponents = {
  HoverCardArrow: typeof ArrowExport;
  HoverCardContent: typeof ContentExport;
  HoverCardPositioner: typeof PositionerExport;
  HoverCardRoot: typeof RootExport;
  HoverCardTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build the same Hover Card tree for published SSR and client hydration. */
export function renderHoverCardHydrationTree(
  {
    HoverCardArrow,
    HoverCardContent,
    HoverCardPositioner,
    HoverCardRoot,
    HoverCardTrigger,
    Portal,
  }: HoverCardHydrationComponents,
  initialOpen = false,
): JSX.Element {
  return createComponent(HoverCardRoot, {
    defaultOpen: initialOpen,
    openDelay: 0,
    closeDelay: 0,
    lazyMount: true,
    unmountOnExit: true,
    /** Keep the trigger and portal under one primitive machine. */
    get children() {
      return [
        createComponent(HoverCardTrigger, {
          'data-testid': 'hydrated-hover-trigger',
          children: 'Preview hydrated member',
        }),
        createComponent(Portal, {
          /** Move the surface into a browser portal during hydration. */
          get children() {
            return createComponent(HoverCardPositioner, {
              /** Retain the primitive's positioning and presence context. */
              get children() {
                return createComponent(HoverCardContent, {
                  'data-testid': 'hydrated-hover-content',
                  /** Render the default arrow and readable preview. */
                  get children() {
                    return [createComponent(HoverCardArrow, {}), 'Published Hover Card content'];
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
