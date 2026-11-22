import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { afterEach, expect, it } from 'vitest';
import { Listbox, createListCollection } from '../index';

afterEach(cleanup);

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue', disabled: true },
];

/** Exercise public parts, selection state, grouped options, and default icon. */
async function verifiesSelection(): Promise<void> {
  const collection = createListCollection({ items: frameworks });
  const changes: string[][] = [];

  /** Record the selected values exposed by the primitive's machine. */
  function recordValue(details: { value: string[] }): void {
    changes.push(details.value);
  }

  render(
    /** Mount the complete listbox inside its Listbox root. */
    () => (
      <>
        <Listbox.Root collection={collection} onValueChange={recordValue}>
          <Listbox.Label>
            Frameworks: <Listbox.ValueText placeholder="Choose one" />
          </Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <Listbox.ItemGroup>
                <Listbox.ItemGroupLabel>Framework choices</Listbox.ItemGroupLabel>
                <For each={frameworks}>
                  {
                    /** Keep each rendered item tied to the same collection. */
                    (item) => (
                      <Listbox.Item item={item}>
                        <Listbox.ItemText>{item.label}</Listbox.ItemText>
                        <Listbox.ItemIndicator />
                      </Listbox.Item>
                    )
                  }
                </For>
              </Listbox.ItemGroup>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </>
    ),
  );

  const listbox = screen.getByRole('listbox');
  const solid = screen.getByRole('option', { name: 'Solid' });
  // The primitive puts the listbox role on List, inside the styled Content surface.
  expect(listbox.className).toContain('leverui-listbox__list');
  expect(listbox.parentElement?.className).toContain('leverui-listbox__content');
  expect(listbox.closest('[data-listbox-root]')?.className).toContain('leverui-listbox__root');
  expect(listbox.closest('[data-listbox-root]')?.className).not.toContain('leverui-leverui');
  expect(solid.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(screen.getByText('Choose one')).toBeInTheDocument();
  fireEvent.click(solid);
  await waitFor(
    /** Follow the selected option and visible value text. */
    () => expect(solid).toHaveAttribute('aria-selected', 'true'),
  );
  expect(screen.getByText('Solid', { selector: '[data-listbox-value-text]' })).toBeInTheDocument();
  expect(changes).toEqual([['solid']]);
}

it('selects a grouped option through public Listbox parts', verifiesSelection);

/** A disabled collection item must retain its semantics and ignore selection. */
function verifiesDisabledItem(): void {
  const collection = createListCollection({ items: frameworks });
  const changes: string[][] = [];

  /** Capture unexpected changes from the disabled option. */
  function recordValue(details: { value: string[] }): void {
    changes.push(details.value);
  }

  render(
    /** Render disabled and enabled items from one collection. */
    () => (
      <>
        <Listbox.Root collection={collection} onValueChange={recordValue}>
          <Listbox.Content>
            <Listbox.List>
              <For each={frameworks}>
                {
                  /** Preserve each item's disabled collection metadata. */
                  (item) => <Listbox.Item item={item}>{item.label}</Listbox.Item>
                }
              </For>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </>
    ),
  );

  const disabled = screen.getByRole('option', { name: 'Vue' });
  expect(disabled).toHaveAttribute('aria-disabled', 'true');
  fireEvent.click(disabled);
  expect(changes).toEqual([]);
}

it('keeps disabled options unselected', verifiesDisabledItem);
