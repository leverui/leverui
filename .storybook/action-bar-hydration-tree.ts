import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  ActionBar as ActionBarExport,
  Button as ButtonExport,
  Portal as PortalExport,
  Theme as ThemeExport,
} from '../src';
import type { ActionBarOpenChangeDetails } from '../src';

export type ActionBarHydrationComponents = {
  ActionBar: typeof ActionBarExport;
  Button: typeof ButtonExport;
  Portal: typeof PortalExport;
  Theme: typeof ThemeExport;
};

/** Build identical controlled Action Bars on the server and in the browser. */
export function renderActionBarHydrationTree(
  { ActionBar, Button, Portal, Theme }: ActionBarHydrationComponents,
  initiallyOpen: boolean,
  portalled = false,
): JSX.Element {
  const [open, setOpen] = createSignal(initiallyOpen);

  /** Open the bar using a selection-like external control. */
  function showBar(): void {
    setOpen(true);
  }

  /** Keep the primitive dismissal and the external state synchronized. */
  function changeOpen(details: ActionBarOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Build the same presence-controlled positioner for either mount path. */
  function renderPositioner(): JSX.Element {
    return createComponent(ActionBar.Positioner, {
      'data-testid': 'hydrated-action-bar-positioner',
      /** Lazily mount the content only when the primitive opens the bar. */
      get children() {
        return createComponent(ActionBar.Content, {
          'aria-label': 'Hydrated selection actions',
          'data-testid': 'hydrated-action-bar-content',
          /** Expose a closing control within the Popover context. */
          get children() {
            return createComponent(ActionBar.CloseTrigger, {
              'data-testid': 'hydrated-action-bar-close',
              children: 'Close actions',
            });
          },
        });
      },
    });
  }

  /** Recreate the source mode explicitly beneath the body portal. */
  function renderPortalledPositioner(): JSX.Element {
    return createComponent(Portal, {
      /** Keep the theme bridge in the same tree before and after hydration. */
      get children() {
        return createComponent(Theme, {
          appearance: 'dark',
          hasBackground: false,
          id: 'hydrated-action-bar-theme-bridge',
          /** Render the presence-controlled bar inside the explicit portal scope. */
          get children() {
            return renderPositioner();
          },
        });
      },
    });
  }

  return [
    createComponent(Button, {
      type: 'button' as const,
      onClick: showBar,
      'data-testid': 'hydrated-action-bar-open',
      children: 'Select item',
    }),
    createComponent(ActionBar.Root, {
      /** Read the current controlled state during hydration and after clicks. */
      get open() {
        return open();
      },
      onOpenChange: changeOpen,
      /** Keep the positioner present before and after hydration. */
      get children() {
        return portalled ? renderPortalledPositioner() : renderPositioner();
      },
    }),
  ];
}
