import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, For, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Combobox, createListCollection } from '../index';

afterEach(cleanup);

const choices = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
];

/** Keep a caller-owned machine when presentation defaults change. */
function verifiesRootProviderAndDefaults(): void {
  const collection = createListCollection({ items: choices });
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Create the external machine inside a live Solid owner. */
  function Example(): JSX.Element {
    const machine = Combobox.useCombobox({ collection, defaultValue: ['alpha'] });
    return (
      <>
        <Combobox.PropsProvider value={() => ({ size: size(), collection })}>
          <Combobox.RootProvider value={machine} data-testid="provided-root">
            <Combobox.Label>Provided choice</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input data-testid="provided-input" />
              <Combobox.Trigger aria-label="Show choices" />
            </Combobox.Control>
            <Combobox.Context>
              {
                /** Read the caller-owned machine through the public context. */
                (api) => <output data-testid="provided-value">{api().value.join(',')}</output>
              }
            </Combobox.Context>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.List>
                  <For each={choices}>
                    {
                      /** Render options under the external machine. */
                      (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                    }
                  </For>
                </Combobox.List>
              </Combobox.Content>
            </Combobox.Positioner>
          </Combobox.RootProvider>
        </Combobox.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the machine and finite CSS defaults together. */
    () => <Example />,
  );
  const input = screen.getByTestId('provided-input') as HTMLInputElement;
  const root = screen.getByTestId('provided-root');
  const originalClass = root.className;
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(input.value).toBe('Alpha');
  expect(screen.getByTestId('provided-value').textContent).toBe('alpha');
  setSize('lg');
  flush();
  expect(screen.getByTestId('provided-input')).toBe(input);
  expect(root.className).toBe(originalClass);
  expect(root).toHaveAttribute('data-size', 'lg');
  expect(input).toHaveAttribute('data-size', 'lg');
  expect(input.value).toBe('Alpha');
}

it(
  'keeps caller-owned state under reactive presentation defaults',
  verifiesRootProviderAndDefaults,
);

/** Preserve the primitive's keyboard and ref behavior on caller-rendered elements. */
async function verifiesChildRenderedParts(): Promise<void> {
  const collection = createListCollection({ items: choices });
  let rootRef: Element | undefined;

  /** Capture the selected native root element. */
  function captureRoot(element: Element): void {
    rootRef = element;
  }

  render(
    /** Mount caller-rendered root, trigger, and item under the same machine. */
    () => (
      <>
        <Combobox.Root
          collection={collection}
          ref={captureRoot}
          asChild={
            /** Keep the primitive's root attributes on the selected section. */
            (getProps) => <section {...getProps()} data-testid="child-root" />
          }
        >
          <Combobox.Label>Custom choice</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input data-testid="child-input" />
            <Combobox.Trigger
              aria-label="Show custom choices"
              asChild={
                /** Keep the primitive's button behavior on a caller-rendered button. */
                (getProps) => <button {...getProps()} data-testid="child-trigger" />
              }
            />
          </Combobox.Control>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.List>
                <Combobox.Item
                  item={choices[1]}
                  asChild={
                    /** Retain option state on a caller-rendered div. */
                    (getProps) => <div {...getProps()} data-testid="child-item" />
                  }
                >
                  Beta
                </Combobox.Item>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Positioner>
        </Combobox.Root>
      </>
    ),
  );

  const root = screen.getByTestId('child-root');
  const input = screen.getByTestId('child-input') as HTMLInputElement;
  expect(root.tagName).toBe('SECTION');
  expect(rootRef).toBe(root);
  fireEvent.click(screen.getByTestId('child-trigger'));
  const item = await screen.findByTestId('child-item');
  expect(item.getAttribute('role')).toBe('option');
  fireEvent.click(item);
  await waitFor(
    /** Read the item label from the primitive's selected input state. */
    () => expect(input.value).toBe('Beta'),
  );
}

it('preserves caller-rendered root and part semantics', verifiesChildRenderedParts);
