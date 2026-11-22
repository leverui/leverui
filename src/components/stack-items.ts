import { type ResolvedElement } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** A stable rendered child retained across separator updates. */
export interface StackItem {
  readonly content: JSX.Element;
}

/** Recognize native elements without requiring a browser global during SSR. */
function isDomElement(value: unknown): value is Element {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    value.nodeType === 1 &&
    'tagName' in value &&
    typeof value.tagName === 'string'
  );
}

/** Read the guarded Solid server element record used by the package runtime. */
function serverMarkup(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || !('t' in value)) return undefined;
  return typeof value.t === 'string' ? value.t : undefined;
}

/** Count only native elements as Stack items when inserting separators. */
function isElementChild(value: unknown): value is object {
  if (isDomElement(value)) return true;
  const markup = serverMarkup(value);
  return markup !== undefined && /^<[A-Za-z][\w:-]*(?:\s|\/?>)/.test(markup);
}

/** Resolve native element items without losing mounted node identity. */
export function collectStackItems(
  parts: readonly ResolvedElement[],
  cache: WeakMap<object, StackItem>,
): StackItem[] {
  const items: StackItem[] = [];
  for (const part of parts) {
    if (isElementChild(part)) {
      let item = cache.get(part);
      if (!item) {
        item = { content: part };
        cache.set(part, item);
      }
      items.push(item);
    }
  }
  return items;
}
