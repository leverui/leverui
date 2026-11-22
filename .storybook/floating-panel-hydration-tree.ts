import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  FloatingPanelBody as BodyExport,
  FloatingPanelCloseTrigger as CloseTriggerExport,
  FloatingPanelContent as ContentExport,
  FloatingPanelHeader as HeaderExport,
  FloatingPanelPositioner as PositionerExport,
  FloatingPanelRoot as RootExport,
  FloatingPanelTitle as TitleExport,
  FloatingPanelTrigger as TriggerExport,
  Portal as PortalExport,
} from '../src';

export type FloatingPanelHydrationComponents = {
  FloatingPanelBody: typeof BodyExport;
  FloatingPanelCloseTrigger: typeof CloseTriggerExport;
  FloatingPanelContent: typeof ContentExport;
  FloatingPanelHeader: typeof HeaderExport;
  FloatingPanelPositioner: typeof PositionerExport;
  FloatingPanelRoot: typeof RootExport;
  FloatingPanelTitle: typeof TitleExport;
  FloatingPanelTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build identical Floating Panel trees for published SSR and client hydration. */
export function renderFloatingPanelHydrationTree(
  {
    FloatingPanelBody,
    FloatingPanelCloseTrigger,
    FloatingPanelContent,
    FloatingPanelHeader,
    FloatingPanelPositioner,
    FloatingPanelRoot,
    FloatingPanelTitle,
    FloatingPanelTrigger,
    Portal,
  }: FloatingPanelHydrationComponents,
  initialOpen = false,
): JSX.Element {
  return createComponent(FloatingPanelRoot, {
    defaultOpen: initialOpen,
    /** Keep trigger and portal under the same primitive machine context. */
    get children() {
      return [
        createComponent(FloatingPanelTrigger, {
          'data-testid': 'hydrated-floating-trigger',
          children: 'Open hydrated panel',
        }),
        createComponent(Portal, {
          /** Move open content into a browser portal during hydration. */
          get children() {
            return createComponent(FloatingPanelPositioner, {
              /** Retain the content's machine and presence relationship. */
              get children() {
                return createComponent(FloatingPanelContent, {
                  'data-testid': 'hydrated-floating-content',
                  /** Render title and close control with stable IDs. */
                  get children() {
                    return [
                      createComponent(FloatingPanelHeader, {
                        /** Group the accessible title and close control. */
                        get children() {
                          return [
                            createComponent(FloatingPanelTitle, {
                              children: 'Hydrated panel title',
                            }),
                            createComponent(FloatingPanelCloseTrigger, {
                              children: 'Close hydrated panel',
                            }),
                          ];
                        },
                      }),
                      createComponent(FloatingPanelBody, {
                        children: 'Published Floating Panel content',
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
