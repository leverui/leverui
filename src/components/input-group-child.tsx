import { children, createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { isServer, type ssr } from '@solidjs/web';

type ServerElement = ReturnType<typeof ssr>;

interface InputGroupChildProps {
  children: JSX.Element;
}

/** Identify a rendered field while ignoring non-field style nodes. */
function isFieldNode(node: unknown): boolean {
  if (!isServer) {
    return node instanceof Element && node.tagName !== 'STYLE';
  }
  if (!isServerElement(node)) return false;
  return /^\s*<(?!style\b)[a-z][\w:-]*/i.test(node.t);
}

/** Narrow Solid's declared server element output without assuming JSX text is markup. */
function isServerElement(node: unknown): node is ServerElement {
  return node !== null && typeof node === 'object' && 't' in node && typeof node.t === 'string';
}

/** Reject group content that cannot represent exactly one field. */
export function InputGroupChild(props: InputGroupChildProps): JSX.Element {
  const content = children(() => props.children);
  const validated = createMemo(
    /** Validate the rendered field whenever reactive children change. */
    (): JSX.Element => {
      const resolved = content();
      const nodes = Array.isArray(resolved) ? resolved : [resolved];
      if (nodes.filter(isFieldNode).length !== 1) {
        throw new Error('InputGroup requires exactly one field child.');
      }
      return resolved;
    },
  );
  return <>{validated()}</>;
}
