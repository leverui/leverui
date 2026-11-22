import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SVGElements, getNextElement, isServer, spread, ssrElement } from '@solidjs/web';
import type { GetChildProps } from '../styled-system/child-props';

export interface CodeBlockHydratableCodeProps {
  tag: keyof JSX.IntrinsicElements;
  getProps: GetChildProps;
}

/** Create one native tag while keeping its server syntax children on hydration. */
function renderHydratableCode(
  tag: keyof JSX.IntrinsicElements,
  getProps: GetChildProps,
): JSX.Element {
  if (isServer) {
    // Solid's server renderer accepts its HTML token even though the client JSX type omits it.
    return ssrElement(tag, getProps(), undefined, true) as JSX.Element & { t: string };
  }

  const isSvg = SVGElements.has(tag);
  const element = getNextElement(
    /** Create the chosen native element when this is a client-only mount. */
    () =>
      isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', tag)
        : document.createElement(tag),
  );
  spread(element, getProps(), true);
  return element;
}

/** Recreate the native tag when a polymorphic code part changes its `as` prop. */
export function CodeBlockHydratableCode(props: CodeBlockHydratableCodeProps): JSX.Element {
  return (
    <Show keyed when={props.tag}>
      {
        /** Render one tag selected by the keyed reactive branch. */
        (tag) => renderHydratableCode(tag, props.getProps)
      }
    </Show>
  );
}
