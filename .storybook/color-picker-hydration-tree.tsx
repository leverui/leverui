import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { ColorPicker as ColorPickerExport, Portal as PortalExport } from '../src';

export type ColorPickerHydrationComponents = {
  ColorPicker: typeof ColorPickerExport;
  Portal: typeof PortalExport;
};

/** Render one identical ColorPicker tree in the server and browser bundles. */
export function renderColorPickerHydrationTree({
  ColorPicker,
  Portal,
}: ColorPickerHydrationComponents): JSX.Element {
  return createComponent(ColorPicker.Root, {
    id: 'hydrated-color-picker',
    defaultValue: ColorPicker.parseColor('#eb5e41'),
    /** Keep form controls and popup under the same machine. */
    get children() {
      return [
        createComponent(ColorPicker.HiddenInput, { name: 'hydrated-color' }),
        createComponent(ColorPicker.Label, { children: 'Hydrated color' }),
        createComponent(ColorPicker.Control, {
          /** Place the hex input beside its native trigger. */
          get children() {
            return [
              createComponent(ColorPicker.Input, {}),
              createComponent(ColorPicker.Trigger, {}),
            ];
          },
        }),
        createComponent(ColorPicker.ValueText, {}),
        createComponent(Portal, {
          /** Keep the present content in the document portal. */
          get children() {
            return createComponent(ColorPicker.Positioner, {
              /** Render both pointer and keyboard color controls. */
              get children() {
                return createComponent(ColorPicker.Content, {
                  /** Supply default area and channel slider parts. */
                  get children() {
                    return [
                      createComponent(ColorPicker.Area, {}),
                      createComponent(ColorPicker.Sliders, {}),
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
