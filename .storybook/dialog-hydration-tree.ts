import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  DialogBackdrop as BackdropExport,
  DialogCloseTrigger as CloseTriggerExport,
  DialogContent as ContentExport,
  DialogDescription as DescriptionExport,
  DialogPositioner as PositionerExport,
  DialogRoot as RootExport,
  DialogTitle as TitleExport,
  DialogTrigger as TriggerExport,
  Portal as PortalExport,
  DialogOpenChangeDetails,
  DialogRootProps,
} from '../src';

export type DialogHydrationComponents = {
  DialogBackdrop: typeof BackdropExport;
  DialogCloseTrigger: typeof CloseTriggerExport;
  DialogContent: typeof ContentExport;
  DialogDescription: typeof DescriptionExport;
  DialogPositioner: typeof PositionerExport;
  DialogRoot: typeof RootExport;
  DialogTitle: typeof TitleExport;
  DialogTrigger: typeof TriggerExport;
  Portal: typeof PortalExport;
};

/** Build the same controlled Dialog tree on the published server and client. */
export function renderDialogHydrationTree(
  {
    DialogBackdrop,
    DialogCloseTrigger,
    DialogContent,
    DialogDescription,
    DialogPositioner,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    Portal,
  }: DialogHydrationComponents,
  initialOpen = false,
  size?: DialogRootProps['size'],
): JSX.Element {
  const [open, setOpen] = createSignal(initialOpen);

  /** Write the primitive's open change into the shared consumer signal. */
  function updateOpen(details: DialogOpenChangeDetails): void {
    setOpen(details.open);
  }

  return createComponent(DialogRoot, {
    /** Follow the controlled signal after the trigger opens the Dialog. */
    get open() {
      return open();
    },
    onOpenChange: updateOpen,
    placement: 'center',
    size,
    /** Create the trigger and portalled content beneath the primitive's provider. */
    get children() {
      return [
        createComponent(DialogTrigger, {
          'data-testid': 'hydrated-dialog-trigger',
          children: 'Open hydrated dialog',
        }),
        createComponent(Portal, {
          /** Render the overlay in the browser portal after it opens. */
          get children() {
            return [
              createComponent(DialogBackdrop, { id: 'hydrated-dialog-backdrop' }),
              createComponent(DialogPositioner, {
                /** Keep content under the primitive's positioner and presence. */
                get children() {
                  return createComponent(DialogContent, {
                    'data-testid': 'hydrated-dialog-content',
                    /** Preserve title, description, and close relationships. */
                    get children() {
                      return [
                        createComponent(DialogTitle, { children: 'Hydrated dialog title' }),
                        createComponent(DialogDescription, {
                          children: 'Hydrated dialog description',
                        }),
                        createComponent(Dynamic, {
                          component: 'input',
                          'aria-label': 'Hydrated dialog input',
                        }),
                        createComponent(DialogCloseTrigger, {
                          children: 'Close hydrated dialog',
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
