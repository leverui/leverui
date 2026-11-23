import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { HStack as HStackExport, RadioCard as RadioCardExport } from '../dist/index.js';
import { guideExplorerItems } from './radio-card-guide-data';

export type RadioCardExplorerComponents = {
  HStack: typeof HStackExport;
  RadioCard: typeof RadioCardExport;
};

/** Render the Explorer's described cards and selected check. */
export function renderRadioCardExplorer(components: RadioCardExplorerComponents): JSX.Element {
  const { HStack, RadioCard } = components;

  return (
    <>
      <RadioCard.Root
        defaultValue="next"
        name="favorite-framework"
        data-testid="guide-radio-card-explorer"
      >
        <RadioCard.Label>Select your favorite framework</RadioCard.Label>
        <HStack align="stretch" gap="4" wrap="wrap">
          <For each={guideExplorerItems}>
            {
              /** Keep the Explorer metadata under each native radio label. */
              (item) => (
                <RadioCard.Item value={item.value} class="lui-radio-card-explorer-item">
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemContent>
                      <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                      <RadioCard.ItemDescription class="lui-radio-card-explorer-description">
                        {item.description}
                      </RadioCard.ItemDescription>
                    </RadioCard.ItemContent>
                    <RadioCard.ItemIndicator
                      class="lui-radio-card-explorer-indicator"
                      checked={
                        /** Style the selected SVG as the indicator root. */
                        (getProps) => (
                          <svg
                            {...getProps()}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                            data-icon="check"
                          >
                            <path d="m4 12 5 5L20 6" />
                          </svg>
                        )
                      }
                    />
                  </RadioCard.ItemControl>
                  <RadioCard.ItemAddon class="lui-radio-card-explorer-addon">
                    {item.addon}
                  </RadioCard.ItemAddon>
                </RadioCard.Item>
              )
            }
          </For>
        </HStack>
      </RadioCard.Root>
    </>
  );
}
