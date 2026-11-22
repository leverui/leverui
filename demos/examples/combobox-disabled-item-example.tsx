import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, HStack, Icon, Portal, Span, useFilter, useListCollection } from '../../src';
import { HalcyonLogo, LumenLogo, NorthwindLogo, QuartzLogo } from './brand-logos';
import './combobox-examples.css';

const companies = [
  { id: 'northwind', name: 'Northwind', logo: NorthwindLogo, color: '#2563eb', disabled: false },
  { id: 'halcyon', name: 'Halcyon', logo: HalcyonLogo, color: '#0d9488', disabled: true },
  { id: 'quartz', name: 'Quartz', logo: QuartzLogo, color: '#7c3aed', disabled: false },
  { id: 'lumen', name: 'Lumen', logo: LumenLogo, color: '#d97706', disabled: false },
];

/** Keep Halcyon visible but unavailable among branded company options. */
export function ComboboxDisabledItemExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: companies,
    itemToValue:
      /** Use each company's stable identifier as its machine value. */
      (item) => item.id,
    itemToString:
      /** Show the company name in the editable input. */
      (item) => item.name,
    isItemDisabled:
      /** Retain disabled options without allowing their selection. */
      (item) => item.disabled,
    filter:
      /** Match company names without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter the visible company list when the input changes. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      style={{ width: '320px' }}
    >
      <Combobox.Label>Select a company</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search companies" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List>
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Companies</Combobox.ItemGroupLabel>
                <For each={collection().items}>
                  {
                    /** Render each logo beside its company name. */
                    (item) => (
                      <Combobox.Item item={item}>
                        <HStack gap="3">
                          <Icon class="example-combobox-logo" style={{ color: item.color }}>
                            {item.logo({ 'aria-hidden': 'true' })}
                          </Icon>
                          <Span class="example-combobox-name">{item.name}</Span>
                        </HStack>
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    )
                  }
                </For>
              </Combobox.ItemGroup>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
