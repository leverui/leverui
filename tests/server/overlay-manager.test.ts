import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  CloseButton as CloseButtonExport,
  createOverlay as CreateOverlayExport,
} from '../../src';

type ServerComponents = {
  CloseButton: typeof CloseButtonExport;
  createOverlay: typeof CreateOverlayExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** An overlay that renders a labeled button, so its markup is easy to find. */
const notice = server.createOverlay<{ label: string }>(
  /** Render the overlay's content. */
  (props) => createComponent(server.CloseButton, { 'aria-label': props.label }),
);

/** Render the overlay viewport on the server. */
function renderViewport(): string {
  return renderToString(
    /** Create the viewport inside the server render. */
    (): JSX.Element => createComponent(notice.Viewport, {}),
  );
}

/** With nothing open, the viewport renders nothing, so a page has no stray markup. */
function verifiesEmptyViewport(): void {
  expect(renderViewport()).toBe('');
}

/**
 * An overlay opened on the server still renders nothing: the viewport shows overlays only
 * once the page runs in the browser, so server HTML never holds one and hydration cannot
 * mismatch. `remove` clears the stored entry at once; `close` would wait for a closing
 * animation, which never runs on the server.
 */
function verifiesServerOpenStaysOutOfMarkup(): void {
  void notice.open('server-notice', { label: 'Server notice' });
  expect(notice.has('server-notice')).toBe(true);
  expect(renderViewport()).toBe('');
  notice.remove('server-notice');
  expect(notice.has('server-notice')).toBe(false);
  expect(notice.getSnapshot()).toEqual([]);
}

test(
  'Overlay viewport renders nothing on the server when no overlay is open',
  verifiesEmptyViewport,
);
test(
  'Overlay manager keeps open overlays out of server markup',
  verifiesServerOpenStaysOutOfMarkup,
);
