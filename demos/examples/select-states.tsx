import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Field, Portal, Select } from '../../src';

const animals = Select.createListCollection({
  items: [
    { label: 'Red panda', value: 'red panda' },
    { label: 'Cat', value: 'cat', disabled: true },
    { label: 'Dog', value: 'dog' },
    { label: 'Aardvark', value: 'aardvark', disabled: true },
    { label: 'Kangaroo', value: 'kangaroo' },
    { label: 'Snake', value: 'snake' },
  ],
});

const plans = Select.createListCollection({
  items: [
    { label: 'Free', value: 'free' },
    { label: 'Starter', value: 'starter' },
    { label: 'Team', value: 'team' },
    { label: 'Enterprise', value: 'enterprise' },
  ],
});

/** Keep a disabled Select visibly inert. */
export function SelectDisabled(): JSX.Element {
  return (
    <Select.Root disabled collection={plans} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select plan</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select plan" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={plans.items}>
                {(plan) => (
                  <Select.Item item={plan}>
                    {plan.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

const countries = Select.createListCollection({
  items: [
    { label: 'Canada', value: 'canada' },
    { label: 'Mexico', value: 'mexico' },
    { label: 'Brazil', value: 'brazil' },
    { label: 'Japan', value: 'japan' },
  ],
});

/** Carry Field's invalid state and error text around Select. */
export function SelectInvalid(): JSX.Element {
  return (
    <Field.Root invalid>
      <Select.Root collection={countries} size="sm" style={{ width: '320px' }}>
        <Select.HiddenSelect />
        <Select.Label>Select country</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select country" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.List>
                <For each={countries.items}>
                  {(country) => (
                    <Select.Item item={country}>
                      {country.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  )}
                </For>
              </Select.List>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Field.ErrorText>Country is required</Field.ErrorText>
    </Field.Root>
  );
}

/** Show disabled choices within an otherwise usable animal Select. */
export function SelectDisabledOption(): JSX.Element {
  return (
    <Select.Root collection={animals} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select animal</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Animal" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={animals.items}>
                {(animal) => (
                  <Select.Item item={animal}>
                    {animal.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
