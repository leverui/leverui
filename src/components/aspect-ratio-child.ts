import { type children } from 'solid-js';
import { type JSX } from '@solidjs/web';

const childError = 'AspectRatio requires exactly one element child.';

/** Recognize a client element without assuming every node-shaped object is a DOM element. */
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

/** Read Solid 1.9's private server JSX `t` markup in one guarded interop boundary. */
function serverMarkup(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || !('t' in value)) return undefined;
  return typeof value.t === 'string' ? value.t : undefined;
}

/** Accept native client elements and Solid server records beginning with an element. */
function isElementChild(value: unknown): boolean {
  if (isDomElement(value)) return true;
  const markup = serverMarkup(value);
  return markup !== undefined && /^<[A-Za-z][\w:-]*(?:\s|\/?>)/.test(markup);
}

/** Require exactly one native element child in client and server trees. */
export function requireSingleChild(content: ReturnType<typeof children>): JSX.Element {
  let count = 0;
  for (const part of content.toArray()) {
    if (part === null || part === undefined) continue;
    if (!isElementChild(part)) throw new Error(childError);
    count += 1;
  }
  if (count !== 1) throw new Error(childError);
  return content();
}
