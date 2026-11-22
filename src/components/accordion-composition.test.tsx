import { cleanup, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Accordion } from '../index';

afterEach(cleanup);

/** Compose one item under either root mode. */
function Item(props: { value: string; title: string }): JSX.Element {
  return (
    <Accordion.Item value={props.value}>
      <Accordion.ItemTrigger>
        {props.title}
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>{props.title} panel</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

/** Style a caller-owned machine without replacing its selected value. */
function verifiesRootProvider(): void {
  /** Create the machine under the primitive's environment and locale providers. */
  function ProviderExample(): JSX.Element {
    const accordion = Accordion.useAccordion({ defaultValue: ['second'] });
    return (
      <Accordion.RootProvider value={accordion} variant="subtle" data-testid="external-root">
        <Item value="first" title="First" />
        <Item value="second" title="Second" />
      </Accordion.RootProvider>
    );
  }

  render(
    /** Mount the caller-owned machine in one Solid owner. */
    () => (
      <>
        <ProviderExample />
      </>
    ),
  );
  expect(screen.getByTestId('external-root').className).toContain('accordion__root');
  expect(screen.getByRole('button', { name: 'Second' }).getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-expanded')).toBe('false');
}

it('styles a caller-owned Accordion machine', verifiesRootProvider);

/** Inherit render strategy and native defaults unless RootProvider overrides them. */
function verifiesInheritedRootProvider(): void {
  /** Construct one closed caller-owned machine under reactive root defaults. */
  function ProviderExample(props: { lazyMount?: boolean }): JSX.Element {
    const machine = Accordion.useAccordion();
    return (
      <>
        <Accordion.PropsProvider
          value={{ lazyMount: true, class: 'inherited-accordion', title: 'Inherited root' }}
        >
          <Accordion.RootProvider value={machine} lazyMount={props.lazyMount}>
            <Item value="first" title="Inherited" />
          </Accordion.RootProvider>
        </Accordion.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the inherited lazy strategy for the first assertion. */
    () => <ProviderExample />,
  );
  const root = screen.getByTitle('Inherited root');
  expect(root.className).toContain('inherited-accordion');
  expect(screen.queryByText('Inherited panel')).toBeNull();
  cleanup();
  render(
    /** Override lazy mounting on the next caller-owned root. */
    () => <ProviderExample lazyMount={false} />,
  );
  expect(screen.queryByText('Inherited panel')).not.toBeNull();
}

it('applies inherited RootProvider defaults with a local override', verifiesInheritedRootProvider);

/** Keep inherited machine IDs from replacing a caller-owned root ID. */
function verifiesInheritedMachineId(): void {
  let machineRootId: string | undefined;

  /** Expose the machine's own ID beside its rendered root. */
  function ProviderExample(): JSX.Element {
    const machine = Accordion.useAccordion({ id: 'owned-machine' });
    const scopedId: unknown = Reflect.get(machine().getRootProps(), 'data-accordion-root');
    machineRootId = typeof scopedId === 'string' ? scopedId : undefined;
    return (
      <>
        <Accordion.PropsProvider value={{ id: 'inherited-machine', title: 'Inherited title' }}>
          <Accordion.RootProvider value={machine} data-testid="owned-root">
            <Item value="first" title="First" />
          </Accordion.RootProvider>
        </Accordion.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the external machine under an inherited ID default. */
    () => <ProviderExample />,
  );
  const root = screen.getByTestId('owned-root');
  // Zag 2 identifies the root by its scoped part attribute rather than an `id`.
  expect(machineRootId).toBe('owned-machine');
  expect(root.getAttribute('data-accordion-root')).toBe(machineRootId);
  expect(root.id).not.toBe('inherited-machine');
  expect(root.title).toBe('Inherited title');
}

it('preserves the caller-owned machine ID under root defaults', verifiesInheritedMachineId);

/** Let reactive defaults change native appearance without replacing the primitive state. */
function verifiesPropsProvider(): void {
  /** Own the default size outside the Accordion root. */
  function ProviderExample(): JSX.Element {
    const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

    /** Change the inherited size from an external control. */
    function grow(): void {
      setSize('lg');
      flush();
    }

    return (
      <>
        <button type="button" onClick={grow}>
          Grow
        </button>
        <Accordion.PropsProvider
          value={
            /** Read the current default without taking ownership of state. */
            () => ({ size: size() })
          }
        >
          <Accordion.Root defaultValue={['first']}>
            <Item value="first" title="First" />
          </Accordion.Root>
        </Accordion.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the reactive defaults before reading the native size attribute. */
    () => <ProviderExample />,
  );
  const trigger = screen.getByRole('button', { name: 'First' });
  const root = trigger.closest('.leverui-accordion__root');
  expect(root?.getAttribute('data-size')).toBe('sm');
  screen.getByRole('button', { name: 'Grow' }).click();
  expect(root?.getAttribute('data-size')).toBe('lg');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
}

it('updates inherited size without resetting expansion', verifiesPropsProvider);

/** Keep caller-owned native tags and refs on the rendered part. */
function verifiesPolymorphicItem(): void {
  let item: Element | undefined;

  /** Capture the native article element passed through the primitive's part renderer. */
  function captureItem(element: Element): void {
    item = element;
  }

  render(
    /** Render a native article item under a primitive root. */
    () => (
      <>
        <Accordion.Root>
          <Accordion.Item as="article" value="first" ref={captureItem}>
            <Accordion.ItemTrigger>First</Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>First panel</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </>
    ),
  );
  expect(item?.tagName).toBe('ARTICLE');
  expect(item?.querySelector('button')?.textContent).toBe('First');
}

it('preserves a polymorphic item and its ref', verifiesPolymorphicItem);
