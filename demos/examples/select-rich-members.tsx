import { createMemo, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, HStack, Portal, Select } from '../../src';
import { countries, countryItems, memberItems, members } from './select-rich-data';

/** Follow the selected member in the Select machine. */
function MemberValue(): JSX.Element {
  const select = Select.useSelectContext();
  const selected = createMemo(
    /** Resolve the machine value to its member record. */
    () =>
      memberItems.find(
        /** Match the stable member ID. */
        (item) => item.id === select().value[0],
      ),
  );

  return (
    <Select.ValueText placeholder="Select member">
      <Show when={selected()} fallback="Select member">
        {
          /** Keep the chosen avatar beside the readable name. */
          (member) => (
            <HStack>
              <Avatar.Root shape="rounded" size="2xs">
                <Avatar.Image src={member().avatar} alt={member().name} />
                <Avatar.Fallback name={member().name} />
              </Avatar.Root>
              {member().name}
            </HStack>
          )
        }
      </Show>
    </Select.ValueText>
  );
}

/** Show member avatars in both trigger and options. */
export function SelectAvatar(): JSX.Element {
  return (
    <Select.Root
      collection={members}
      size="sm"
      style={{ width: '240px' }}
      defaultValue={['mara_ellison']}
      positioning={{ sameWidth: true }}
    >
      <Select.HiddenSelect />
      <Select.Label>Select member</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <MemberValue />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.List>
            <For each={memberItems}>
              {
                /** Pair each option's avatar and name. */
                (member) => (
                  <Select.Item item={member} style={{ 'justify-content': 'flex-start' }}>
                    <Avatar.Root shape="rounded" size="2xs">
                      <Avatar.Image src={member.avatar} alt={member.name} />
                      <Avatar.Fallback name={member.name} />
                    </Avatar.Root>
                    {member.name}
                    <Select.ItemIndicator />
                  </Select.Item>
                )
              }
            </For>
          </Select.List>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

const continents = ['America', 'Africa', 'Asia', 'Europe', 'Oceania'] as const;

/** Group flag-prefixed countries by continent. */
export function SelectCountry(): JSX.Element {
  return (
    <Select.Root collection={countries} size="sm" style={{ width: '320px' }} defaultValue={['NG']}>
      <Select.HiddenSelect />
      <Select.Label>Select country</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="-" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={continents}>
                {
                  /** Preserve the continent order. */
                  (continent) => (
                    <Select.ItemGroup>
                      <Select.ItemGroupLabel>{continent}</Select.ItemGroupLabel>
                      <For
                        each={countryItems.filter(
                          /** Include only countries in this continent. */
                          (item) => item.continent === continent,
                        )}
                      >
                        {
                          /** Put the flag before the country name. */
                          (item) => (
                            <Select.Item item={item}>
                              {item.flag} {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          )
                        }
                      </For>
                    </Select.ItemGroup>
                  )
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
