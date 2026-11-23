import { cleanup, render, screen } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Select } from '../index';

afterEach(cleanup);

const frameworks = Select.createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue', disabled: true },
  ],
});

/** Render grouped collection items through the public compound API. */
function Options(): JSX.Element {
  return (
    <For each={frameworks.items}>
      {
        /** Keep the machine item tied to its collection object. */
        (item) => (
          <Select.Item item={item}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        )
      }
    </For>
  );
}

/** Exercise initial value, form submission, collection, and styling. */
function verifiesSelection(): void {
  render(
    /** Mount all public Select parts inside one styled provider. */
    () => (
      <>
        <form data-testid="form">
          <Select.Root collection={frameworks} name="framework" defaultValue={['solid']}>
            <Select.HiddenSelect />
            <Select.Label>Framework</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Choose a framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.ClearTrigger aria-label="Clear framework" />
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <Select.ItemGroup>
                    <Select.ItemGroupLabel>Options</Select.ItemGroupLabel>
                    <Options />
                  </Select.ItemGroup>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </form>
      </>
    ),
  );
  const root = screen.getByText('Framework').closest('[data-select-root]');
  expect(root).toHaveClass('lui-select__root');
  expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveClass('lui-select__trigger');
  expect(screen.getByText('Solid', { selector: '[data-select-value-text]' })).toBeInTheDocument();
  expect(root?.querySelector('[data-select-item][data-value="vue"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('framework')).toBe(
    'solid',
  );
}

it('renders a selected collection item and its native form value', verifiesSelection);
