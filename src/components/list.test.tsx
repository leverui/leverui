import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { List, ListRoot } from '../index';

/** Preserve list semantics, native attributes, refs, and stable part hooks. */
function verifiesNativeParts(): void {
  let ordered: HTMLOListElement | undefined;
  let item: HTMLLIElement | undefined;

  /** Record the selected ordered-list node. */
  function captureOrdered(element: HTMLOListElement): void {
    ordered = element;
  }

  /** Record one native list item. */
  function captureItem(element: HTMLLIElement): void {
    item = element;
  }

  render(
    /** Mount both exported list spellings without a styling provider. */
    () => (
      <>
        <List.Root title="Tasks" data-testid="unordered">
          <List.Item data-testid="unordered-item">First</List.Item>
        </List.Root>
        <ListRoot as="ol" ref={captureOrdered} data-testid="ordered" start={3}>
          <List.Item ref={captureItem} data-testid="ordered-item">
            <List.Indicator data-testid="indicator">✓</List.Indicator>
            Third
          </List.Item>
        </ListRoot>
      </>
    ),
  );

  const unordered = screen.getByTestId('unordered');
  const orderedNode = screen.getByTestId('ordered');
  expect(unordered.tagName).toBe('UL');
  expect(unordered.getAttribute('role')).toBe('list');
  expect(unordered.getAttribute('title')).toBe('Tasks');
  expect(orderedNode).toBe(ordered);
  expect(orderedNode.tagName).toBe('OL');
  expect(orderedNode.getAttribute('start')).toBe('3');
  expect(screen.getByTestId('ordered-item')).toBe(item);
  expect(item?.tagName).toBe('LI');
  expect(screen.getByTestId('indicator').tagName).toBe('SPAN');
  expect(orderedNode.className).toContain('lui-list__root');
  expect(item?.className).toContain('lui-list__item');
  expect(orderedNode.hasAttribute('variant')).toBe(false);
  expect(orderedNode.hasAttribute('align')).toBe(false);
}

it('renders native unordered and ordered list parts', verifiesNativeParts);

/** Update inherited variants without replacing a root or its item. */
function verifiesReactiveDefaults(): void {
  const [plain, setPlain] = createSignal(false);

  /** Render inherited and locally fixed lists under one defaults provider. */
  function Example(): JSX.Element {
    return (
      <List.RootPropsProvider value={{ variant: plain() ? 'plain' : 'marker' }}>
        <List.Root data-testid="inherited">
          <List.Item data-testid="inherited-item">Inherited</List.Item>
        </List.Root>
        <List.Root variant="marker" data-testid="fixed">
          <List.Item>Fixed</List.Item>
        </List.Root>
      </List.RootPropsProvider>
    );
  }

  render(
    /** Mount the example before changing its provider signal. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const item = screen.getByTestId('inherited-item');
  const fixed = screen.getByTestId('fixed');
  const initialItemClass = item.className;
  const fixedClass = fixed.className;
  expect(inherited).toHaveAttribute('data-variant', 'marker');
  setPlain(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(screen.getByTestId('inherited-item')).toBe(item);
  expect(inherited).toHaveAttribute('data-variant', 'plain');
  expect(item.className).toBe(initialItemClass);
  expect(fixed.className).toBe(fixedClass);
  expect(fixed).toHaveAttribute('data-variant', 'marker');
}

it('reacts to provider variants and preserves local overrides', verifiesReactiveDefaults);

/** Keep a nested list's slot context separate from its ancestor. */
function verifiesNestedStyles(): void {
  render(
    /** Mount a plain parent and a marker child list. */
    () => (
      <List.Root variant="plain">
        <List.Item data-testid="outer-item">
          <List.Root variant="marker">
            <List.Item data-testid="inner-item">Nested item</List.Item>
          </List.Root>
        </List.Item>
      </List.Root>
    ),
  );

  expect(screen.getByTestId('outer-item').closest('ul')).toHaveAttribute('data-variant', 'plain');
  expect(screen.getByTestId('inner-item').closest('ul')).toHaveAttribute('data-variant', 'marker');
}

it('scopes nested list styles to their nearest root', verifiesNestedStyles);

/** Reject parts that cannot receive their required slot recipe state. */
function verifiesRootRequirement(): void {
  /** Attempt to mount a List item without a root. */
  function mountOrphan(): void {
    render(
      /** Omit ListRoot while mounting a native item. */
      () => <List.Item>Orphan</List.Item>,
    );
  }

  expect(mountOrphan).toThrow(/inside ListRoot/);
}

it('requires a root for styled list parts', verifiesRootRequirement);
