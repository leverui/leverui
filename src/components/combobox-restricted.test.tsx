import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Combobox, createListCollection } from '../index';

afterEach(cleanup);

const choices = [
  { label: 'React', value: 'react', disabled: true },
  { label: 'Solid', value: 'solid', disabled: false },
];

type ExampleProps = {
  disabled?: boolean;
  readOnly?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
};

/** Exercise restricted items, focus, and presence through the public parts. */
function Example(props: ExampleProps): JSX.Element {
  const collection = createListCollection({
    items: choices,
    /** Keep the disabled item in the list while blocking its selection. */
    isItemDisabled: (item) => item.disabled,
  });
  return (
    <>
      <Combobox.Root collection={collection} {...props}>
        <Combobox.Label>Restricted choice</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger aria-label="Open restricted choices" />
        </Combobox.Control>
        <Combobox.Context>
          {
            /** Expose selected values without changing the machine. */
            (api) => <output data-testid="restricted-value">{api().value.join(',')}</output>
          }
        </Combobox.Context>
        <Combobox.Positioner data-testid="restricted-positioner">
          <Combobox.Content>
            <Combobox.List>
              <For each={choices}>
                {
                  /** Render both active and disabled collection items. */
                  (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </>
  );
}

/** Disabled and read-only roots must prevent selection and report native state. */
async function verifiesRestrictedRoots(): Promise<void> {
  render(
    /** Mount a disabled root with its complete compound parts. */
    () => <Example disabled />,
  );
  const disabledInput = screen.getByRole('combobox', { name: 'Restricted choice' });
  expect(disabledInput).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Open restricted choices' }));
  expect(screen.queryByRole('option', { name: 'Solid' })).toBeNull();
  cleanup();

  render(
    /** Mount a read-only root after cleaning the disabled one. */
    () => <Example readOnly />,
  );
  const readOnlyInput = screen.getByRole('combobox', { name: 'Restricted choice' });
  expect(readOnlyInput).toHaveAttribute('readonly');
  fireEvent.click(screen.getByRole('button', { name: 'Open restricted choices' }));
  expect(screen.queryByRole('option', { name: 'Solid' })).toBeNull();
}

it('preserves disabled and read-only machine behavior', verifiesRestrictedRoots);

/** A disabled option must stay unselected while the active option works. */
async function verifiesDisabledItem(): Promise<void> {
  render(
    /** Mount options with one collection item disabled. */
    () => <Example />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open restricted choices' }));
  const disabled = await screen.findByRole('option', { name: 'React' });
  expect(disabled).toHaveAttribute('data-disabled');
  fireEvent.click(disabled);
  expect(screen.getByTestId('restricted-value').textContent).toBe('');
  fireEvent.click(screen.getByRole('option', { name: 'Solid' }));
  await waitFor(
    /** Wait for the enabled item to update selection. */
    () => expect(screen.getByTestId('restricted-value').textContent).toBe('solid'),
  );
}

it('does not select disabled collection items', verifiesDisabledItem);

/** Lazy presence must mount the popup only while the root is open. */
async function verifiesPresence(): Promise<void> {
  render(
    /** Mount an initially absent popup that unmounts after closing. */
    () => <Example lazyMount unmountOnExit />,
  );
  expect(screen.queryByTestId('restricted-positioner')).toBeNull();
  const trigger = screen.getByRole('button', { name: 'Open restricted choices' });
  fireEvent.click(trigger);
  expect(await screen.findByTestId('restricted-positioner')).toBeInTheDocument();
  fireEvent.click(trigger);
  await waitFor(
    /** Wait for unmount-on-exit to remove the popup. */
    () => expect(screen.queryByTestId('restricted-positioner')).toBeNull(),
  );
}

it('keeps lazy popup presence', verifiesPresence);
