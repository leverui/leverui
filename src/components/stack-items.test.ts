import { flush } from 'solid-js';
import { expect, test } from 'vitest';
import { collectStackItems, type StackItem } from './stack-items';

/** Keep native siblings and keyed identity while ignoring non-element content. */
function verifiesStackItems(): void {
  const first = document.createElement('div');
  const second = document.createElement('span');
  const styleElement = document.createElement('style');
  flush();
  const cache = new WeakMap<object, StackItem>();
  const parts = [styleElement, first, 'separator text', second];
  const items = collectStackItems(parts, cache);
  expect(items).toHaveLength(3);
  expect(
    items.map(
      /** Compare each item with its original DOM node. */
      (item) => item.content,
    ),
  ).toEqual([styleElement, first, second]);
  expect(collectStackItems(parts, cache)[0]).toBe(items[0]);
}

test('Stack collects native element children with stable identity', verifiesStackItems);
