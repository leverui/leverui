import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { expect, it } from 'vitest';
import { type JSX } from '@solidjs/web';
import { Presence } from './presence';

/**
 * Reject style props at a JSX call site. Solid 2's element types carry a
 * `data-*` index signature, so plain assignability no longer rejects an object
 * of unknown keys; JSX still checks each attribute against the props.
 */
export function rejectsStyleProps(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Presence has no css prop. */}
      <Presence css={{ color: 'red' }} />
      {/* @ts-expect-error Presence has no style shorthand props. */}
      <Presence p="4" />
    </>
  );
}

/** Keep the native node and public class while the primitive changes its state. */
function verifiesNativePresence(): void {
  const [present, setPresent] = createSignal(false);
  render(
    /** Mount a Presence node without any styling provider. */
    () => (
      <Presence as="section" present={present()} class="custom-presence" data-testid="presence">
        Native content
      </Presence>
    ),
  );
  const node = screen.getByTestId('presence');
  expect(node.tagName).toBe('SECTION');
  expect(node.classList.contains('leverui-presence')).toBe(true);
  expect(node.classList.contains('custom-presence')).toBe(true);
  expect(node.getAttribute('data-state')).toBe('closed');
  setPresent(true);
  flush();
  expect(screen.getByTestId('presence')).toBe(node);
  expect(node.getAttribute('data-state')).toBe('open');
}

it(
  'renders Presence natively and updates the primitive state without inserted CSS',
  verifiesNativePresence,
);

/** Keep the polymorphic SVG path available without style-object props. */
function verifiesSvgPresence(): void {
  let received: SVGSVGElement | undefined;

  /** Receive the selected native SVG node through the typed ref. */
  function captureSvg(element: SVGSVGElement): void {
    received = element;
  }

  render(
    /** Render an intrinsic SVG node through the public selected-tag path. */
    () => (
      <Presence as="svg" present aria-label="Graphic" data-testid="presence-svg" ref={captureSvg}>
        <circle cx="5" cy="5" r="5" />
      </Presence>
    ),
  );
  const node = screen.getByTestId('presence-svg');
  expect(received).toBe(node);
  expect(node.namespaceURI).toBe('http://www.w3.org/2000/svg');
  expect(node.querySelector('circle')).not.toBeNull();
}

it('preserves Presence SVG polymorphism', verifiesSvgPresence);
