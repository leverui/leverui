import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Clipboard as ClipboardExport } from '../src';

export type ClipboardHydrationComponents = {
  Clipboard: typeof ClipboardExport;
};

/** Render identical provider-free Clipboard markup in both bundles. */
export function renderClipboardHydrationTree({
  Clipboard,
}: ClipboardHydrationComponents): JSX.Element {
  return createComponent(Clipboard.Root, {
    id: 'hydrated-clipboard',
    value: 'Hydrated copy value',
    timeout: 1000,
    /** Keep all native parts under the same primitive machine. */
    get children() {
      return [
        createComponent(Clipboard.Label, { children: 'Hydrated label' }),
        createComponent(Clipboard.Input, {}),
        createComponent(Clipboard.Trigger, {
          /** Render status under the machine-owned button. */
          get children() {
            return [
              createComponent(Clipboard.Indicator, {}),
              createComponent(Clipboard.CopyText, {}),
            ];
          },
        }),
        createComponent(Clipboard.ValueText, {}),
      ];
    },
  });
}
