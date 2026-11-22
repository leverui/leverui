import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { NativeSelect, Stack } from '../../src';
import './native-select-layout.css';

/** Compare all five Native Select sizes. */
export function NativeSelectWithSizes(): JSX.Element {
  return (
    <Stack gap="4" class="example-native-select-sample">
      <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>
        {
          /** Render one size with the same framework choices. */
          (size) => (
            <NativeSelect.Root size={size}>
              <NativeSelect.Field placeholder="Select option">
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the outline, subtle, and plain variants. */
export function NativeSelectWithVariants(): JSX.Element {
  return (
    <Stack gap="4" class="example-native-select-sample">
      <For each={['outline', 'subtle', 'plain'] as const}>
        {
          /** Label each select with the variant it demonstrates. */
          (variant) => (
            <NativeSelect.Root variant={variant}>
              <NativeSelect.Field placeholder={`variant (${variant})`}>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          )
        }
      </For>
    </Stack>
  );
}
