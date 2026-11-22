import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import { DataList, DataListRoot } from '../index';

type GetChildProps = Parameters<RenderChild>[0];

/** Render a consumer-owned native list using merged root attributes. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return <dl {...getProps({ class: 'owned-root' })} data-testid="owned-root" />;
}

/** Render a consumer-owned term using merged part attributes. */
function renderOwnedTerm(getProps: GetChildProps): JSX.Element {
  return <dt {...getProps({ class: 'owned-term' })} data-testid="owned-term" />;
}

/** Keep description-list semantics and native attributes on every part. */
function verifiesNativeParts(): void {
  let root: HTMLDListElement | undefined;
  let label: HTMLElement | undefined;

  /** Capture the semantic list element. */
  function captureRoot(element: HTMLDListElement): void {
    root = element;
  }

  /** Capture the native term element. */
  function captureLabel(element: HTMLElement): void {
    label = element;
  }

  render(
    /** Mount the exported namespace and its native parts. */
    () => (
      <DataList.Root ref={captureRoot} title="Account details" data-testid="list">
        <DataList.Item data-testid="item">
          <DataList.ItemLabel ref={captureLabel} data-testid="label">
            Status
          </DataList.ItemLabel>
          <DataList.ItemValue data-testid="value">Active</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    ),
  );

  const list = screen.getByTestId('list');
  expect(list).toBe(root);
  expect(list.tagName).toBe('DL');
  expect(list.getAttribute('title')).toBe('Account details');
  expect(screen.getByTestId('item').tagName).toBe('DIV');
  expect(screen.getByTestId('label')).toBe(label);
  expect(label?.tagName).toBe('DT');
  expect(screen.getByTestId('value').tagName).toBe('DD');
  expect(list.className).toContain('leverui-data-list__root');
  expect(label?.className).toContain('leverui-data-list__itemLabel');
  expect(list.hasAttribute('size')).toBe(false);
  expect(list.hasAttribute('orientation')).toBe(false);
  expect(list.hasAttribute('variant')).toBe(false);
}

it('renders native description-list parts and forwards refs', verifiesNativeParts);

/** Update scoped recipe defaults without remounting a list or its parts. */
function verifiesReactiveDefaults(): void {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Render inherited and explicit Data List variants together. */
  function Example(): JSX.Element {
    return (
      <DataList.PropsProvider
        value={{
          orientation: horizontal() ? 'horizontal' : 'vertical',
          size: horizontal() ? 'lg' : 'sm',
        }}
      >
        <DataList.Root data-testid="inherited">
          <DataList.Item data-testid="inherited-item">
            <DataList.ItemLabel>Name</DataList.ItemLabel>
            <DataList.ItemValue>Ada</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root orientation="vertical" size="md" data-testid="fixed">
          <DataList.Item>
            <DataList.ItemLabel>Role</DataList.ItemLabel>
            <DataList.ItemValue>Engineer</DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </DataList.PropsProvider>
    );
  }

  render(
    /** Mount the provider before updating its signal. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const fixed = screen.getByTestId('fixed');
  const inheritedClass = inherited.className;
  const itemClass = screen.getByTestId('inherited-item').className;
  const fixedClass = fixed.className;
  expect(inherited.getAttribute('data-size')).toBe('sm');
  expect(inherited.getAttribute('data-orientation')).toBe('vertical');
  setHorizontal(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(inherited.className).toBe(inheritedClass);
  expect(screen.getByTestId('inherited-item').className).toBe(itemClass);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(inherited.getAttribute('data-orientation')).toBe('horizontal');
  expect(fixed.className).toBe(fixedClass);
  expect(fixed.getAttribute('data-size')).toBe('md');
  expect(fixed.getAttribute('data-orientation')).toBe('vertical');
}

it('reacts to provider variants and preserves instance overrides', verifiesReactiveDefaults);

/** Forward changing content through the semantic term and description nodes. */
function verifiesReactiveValue(): void {
  const [status, setStatus] = createSignal('Pending');
  render(
    /** Mount one data item with live description text. */
    () => (
      <DataListRoot>
        <DataList.Item>
          <DataList.ItemLabel>Status</DataList.ItemLabel>
          <DataList.ItemValue data-testid="status">{status()}</DataList.ItemValue>
        </DataList.Item>
      </DataListRoot>
    ),
  );
  const value = screen.getByTestId('status');
  setStatus('Complete');
  flush();
  expect(screen.getByTestId('status')).toBe(value);
  expect(value.textContent).toBe('Complete');
}

it('updates a description without replacing its native node', verifiesReactiveValue);

/** Reject a part without a root so slot styles cannot silently disappear. */
function verifiesRootRequirement(): void {
  /** Attempt to render a term outside its scoped root. */
  function mountOrphan(): void {
    render(
      /** Create the invalid part without its semantic root. */
      () => <DataList.ItemLabel>Orphan</DataList.ItemLabel>,
    );
  }

  expect(mountOrphan).toThrow(/inside DataListRoot/);
}

it('requires a root for semantic parts', verifiesRootRequirement);

/** Keep native semantics and public classes with caller-owned elements. */
function verifiesCallerOwnedParts(): void {
  render(
    /** Construct the root before its scoped term is evaluated. */
    () => (
      <DataList.Root asChild={renderOwnedRoot}>
        <DataList.Item>
          <DataList.ItemLabel asChild={renderOwnedTerm}>Status</DataList.ItemLabel>
          <DataList.ItemValue>Active</DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    ),
  );
  expect(screen.getByTestId('owned-root').tagName).toBe('DL');
  expect(screen.getByTestId('owned-root').className).toContain('leverui-data-list__root');
  expect(screen.getByTestId('owned-term').tagName).toBe('DT');
  expect(screen.getByTestId('owned-term').className).toContain('leverui-data-list__itemLabel');
  expect(screen.getByTestId('owned-term').textContent).toBe('Status');
}

it('preserves caller-owned native parts through asChild', verifiesCallerOwnedParts);

/** Reject values that authored selectors cannot represent. */
function verifiesInvalidChoice(): void {
  /** Mount a list with an unsupported runtime size. */
  function mountInvalid(): void {
    render(() => <DataList.Root size={'xl' as 'sm'} />);
  }
  expect(mountInvalid).toThrow(/Data List size is unsupported/);
}

it('rejects unsupported finite choices', verifiesInvalidChoice);
