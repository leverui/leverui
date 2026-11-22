import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Button as ButtonExport, NativeSelect as NativeSelectExport } from '../src';

export interface NativeSelectHydrationComponents {
  Button: typeof ButtonExport;
  NativeSelect: typeof NativeSelectExport;
}

/** Render a native option in both the published server and browser trees. */
function option(value: string, label: string): JSX.Element {
  return createComponent(Dynamic, { component: 'option', value, children: label });
}

/** Build the same native select for published SSR and client hydration. */
export function renderNativeSelectHydrationTree({
  Button,
  NativeSelect,
}: NativeSelectHydrationComponents): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const [value, setValue] = createSignal<'ca' | 'us'>('us');

  /** Change the CSS size while preserving the hydrated select. */
  function toggleSize(): void {
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  /** Change the controlled field without replacing its hydrated select. */
  function toggleValue(): void {
    setValue(value() === 'us' ? 'ca' : 'us');
  }

  return [
    createComponent(NativeSelect.Root, {
      id: 'hydrated-native-select',
      /** Keep the root CSS appearance reactive after hydration. */
      get size() {
        return size();
      },
      /** Resolve field and indicator only inside the root. */
      get children() {
        return [
          createComponent(NativeSelect.Field, {
            id: 'hydrated-native-select-field',
            'aria-label': 'Hydrated native select',
            name: 'country',
            placeholder: 'Choose',
            defaultValue: 'ca',
            /** Render options after the field's default is available. */
            get children() {
              return [option('ca', 'Canada'), option('us', 'United States')];
            },
          }),
          createComponent(NativeSelect.Indicator, {}),
        ];
      },
    }),
    createComponent(NativeSelect.Root, {
      /** Keep the controlled select under its own state provider. */
      get children() {
        return createComponent(NativeSelect.Field, {
          id: 'hydrated-controlled-native-select',
          'aria-label': 'Hydrated controlled select',
          /** Track the caller-owned value after hydration. */
          get value() {
            return value();
          },
          /** Render two values for controlled selection. */
          get children() {
            return [option('ca', 'Canada'), option('us', 'United States')];
          },
        });
      },
    }),
    createComponent(Button, {
      id: 'hydrated-native-select-toggle',
      type: 'button' as const,
      onClick: toggleSize,
      children: 'Toggle size',
    }),
    createComponent(Button, {
      id: 'hydrated-controlled-toggle',
      type: 'button' as const,
      onClick: toggleValue,
      children: 'Toggle value',
    }),
  ];
}
