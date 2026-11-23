import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Listbox, createListCollection } from '../index';

afterEach(cleanup);

const options = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];

/** Keep one caller-owned primitive machine under Lever UI presentation defaults. */
async function verifiesExternalMachine(): Promise<void> {
  /** Create the machine in the consumer's Solid component body. */
  function Example(): JSX.Element {
    const collection = createListCollection({ items: options });
    const machine = Listbox.useListbox({ collection, defaultValue: ['react'] });

    return (
      <>
        <Listbox.PropsProvider value={{ variant: 'solid' }}>
          <Listbox.RootProvider value={machine} data-testid="provider-root">
            <Listbox.Label>External frameworks</Listbox.Label>
            <Listbox.Content>
              <Listbox.List>
                <For each={options}>
                  {
                    /** Keep caller-owned collection items under the same machine. */
                    (item) => <Listbox.Item item={item}>{item.label}</Listbox.Item>
                  }
                </For>
              </Listbox.List>
            </Listbox.Content>
            <Listbox.Context>
              {
                /** Expose the current external machine value. */
                (api) => <output data-testid="external-value">{api().value.join(',')}</output>
              }
            </Listbox.Context>
          </Listbox.RootProvider>
        </Listbox.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the externally owned Listbox. */
    () => <Example />,
  );
  const root = screen.getByTestId('provider-root');
  expect(root.className).toContain('lui-listbox__root');
  expect(screen.getByTestId('external-value')).toHaveTextContent('react');
  fireEvent.click(screen.getByRole('option', { name: 'Solid' }));
  await waitFor(
    /** Follow selection through the original machine accessor. */
    () => expect(screen.getByTestId('external-value')).toHaveTextContent('solid'),
  );
}

it('styles an external machine without owning its selection', verifiesExternalMachine);

/** Preserve the primitive roles, caller refs, and events through asChild rendering. */
async function verifiesChildRendering(): Promise<void> {
  const collection = createListCollection({ items: options });
  let rootRef: Element | undefined;

  /** Capture the caller-rendered root. */
  function captureRoot(element: Element): void {
    rootRef = element;
  }

  render(
    /** Use native caller elements while the primitive still owns behavior. */
    () => (
      <>
        <Listbox.Root
          collection={collection}
          ref={captureRoot}
          asChild={
            /** Forward machine root props onto the selected section. */
            (getProps) => <section {...getProps()} data-testid="child-root" />
          }
        >
          <Listbox.Label>Custom choices</Listbox.Label>
          <Listbox.Content>
            <Listbox.List>
              <Listbox.Item
                item={options[1]}
                asChild={
                  /** Keep option state on a caller-rendered div. */
                  (getProps) => <div {...getProps()} data-testid="child-option" />
                }
              >
                Solid
              </Listbox.Item>
            </Listbox.List>
          </Listbox.Content>
        </Listbox.Root>
      </>
    ),
  );

  const root = screen.getByTestId('child-root');
  const option = screen.getByTestId('child-option');
  expect(root.tagName).toBe('SECTION');
  expect(rootRef).toBe(root);
  expect(option).toHaveAttribute('role', 'option');
  fireEvent.click(option);
  await waitFor(
    /** Retain selected semantics on the caller-owned element. */
    () => expect(option).toHaveAttribute('aria-selected', 'true'),
  );
}

it('keeps machine semantics on caller-rendered elements', verifiesChildRendering);
