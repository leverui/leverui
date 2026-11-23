import { flush } from 'solid-js';
import { expect, it } from 'vitest';
import { createGroupItemSync } from './group-items';

/** Keep authored child styles ahead of generated Group positions. */
function verifiesConsumerGroupVariables(): void {
  const group = document.createElement('div');
  const first = document.createElement('button');
  const last = document.createElement('button');
  first.style.setProperty('--lui-group-count', '50');
  first.style.setProperty('--lui-group-index', '40');
  group.append(first, last);
  const { sync } = createGroupItemSync();

  sync(group);
  expect(first.style.getPropertyValue('--lui-group-count')).toBe('50');
  expect(first.style.getPropertyValue('--lui-group-index')).toBe('40');
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('1');

  last.style.setProperty('--lui-group-index', '99');
  sync(group);
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('99');

  last.setAttribute('data-lui-group-skip', '');
  flush();
  sync(group);
  expect(last.style.getPropertyValue('--lui-group-count')).toBe('');
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('99');
  expect(first.style.getPropertyValue('--lui-group-count')).toBe('50');

  last.removeAttribute('data-lui-group-skip');
  sync(group);
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('99');
  last.style.removeProperty('--lui-group-index');
  sync(group);
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('1');
}

it(
  'preserves consumer group variables through indexing and skip changes',
  verifiesConsumerGroupVariables,
);

/** Verify SVG children participate in indexing and an absent skip result includes them. */
function verifiesSvgGroupItems(): void {
  const group = document.createElement('div');
  const first = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const last = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  first.setAttribute('data-separator', 'yes');
  flush();
  group.append(first, last);
  const { sync } = createGroupItemSync();

  sync(
    group,
    /** Leave an SVG child included when the predicate has no opinion. */
    (child) => (child.getAttribute('data-separator') === 'yes' ? undefined : false),
  );
  expect(first.hasAttribute('data-lui-group-first')).toBe(true);
  expect(last.hasAttribute('data-lui-group-last')).toBe(true);
  expect(first.style.getPropertyValue('--lui-group-count')).toBe('2');
  expect(last.style.getPropertyValue('--lui-group-index')).toBe('1');

  first.setAttribute('data-lui-group-skip', '');
  flush();
  sync(group);
  expect(last.hasAttribute('data-lui-group-item')).toBe(false);
}

it('indexes SVG children and accepts undefined from skip', verifiesSvgGroupItems);

/** Verify removed children release generated state and preserve authored values. */
function verifiesMovedChildOwnership(): void {
  const source = document.createElement('div');
  const destination = document.createElement('div');
  const first = document.createElement('button');
  const moved = document.createElement('button');
  const destinationFirst = document.createElement('button');
  first.setAttribute('data-lui-group-first', 'authored');
  flush();
  moved.style.setProperty('--lui-group-index', '40');
  source.append(first, moved);
  destination.append(destinationFirst);
  const sourceItems = createGroupItemSync();
  const destinationItems = createGroupItemSync();

  sourceItems.sync(source);
  expect(first.getAttribute('data-lui-group-first')).toBe('');
  expect(moved.style.getPropertyValue('--lui-group-count')).toBe('2');
  destination.append(moved);
  sourceItems.sync(source);
  sourceItems.dispose();
  expect(first.getAttribute('data-lui-group-first')).toBe('authored');
  expect(moved.hasAttribute('data-lui-group-item')).toBe(false);
  expect(moved.style.getPropertyValue('--lui-group-count')).toBe('');
  expect(moved.style.getPropertyValue('--lui-group-index')).toBe('40');

  moved.style.removeProperty('--lui-group-index');
  destinationItems.sync(destination);
  expect(moved.style.getPropertyValue('--lui-group-index')).toBe('1');
  destinationItems.dispose();
  expect(moved.hasAttribute('data-lui-group-item')).toBe(false);
  expect(moved.style.getPropertyValue('--lui-group-index')).toBe('');
}

it('restores only owned child state after a move and disposal', verifiesMovedChildOwnership);
