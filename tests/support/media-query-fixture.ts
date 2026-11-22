import { cleanup } from '@solidjs/testing-library';

const originalWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
const mediaLists = new Set<EventTarget>();
let mediaRootFontSize = 16;

/** Match CSS lengths using the browser fixture's initial font size. */
function matchesQuery(query: string, currentWindow: Window): boolean {
  const match = query.match(/min-width:\s*(\d+(?:\.\d+)?)(px|rem)/);
  if (!match) return false;
  const threshold = Number(match[1]) * (match[2] === 'rem' ? mediaRootFontSize : 1);
  return currentWindow.innerWidth >= threshold;
}

/** Provide a changing MediaQueryList without relying on jsdom support. */
function fakeMatchMedia(query: string, currentWindow: Window): MediaQueryList {
  const list = new EventTarget();
  const mediaList = Object.assign(list, {
    media: query,
    onchange: null,
    /** Add a legacy media listener through EventTarget. */
    addListener(listener: EventListener): void {
      list.addEventListener('change', listener);
    },
    /** Remove a legacy media listener through EventTarget. */
    removeListener(listener: EventListener): void {
      list.removeEventListener('change', listener);
    },
  });
  Object.defineProperty(mediaList, 'matches', {
    /** Evaluate the query at the current fixture viewport width. */
    get: () => matchesQuery(query, currentWindow),
  });
  mediaLists.add(mediaList);
  // The fixture supplies matches at runtime and inherits EventTarget methods.
  return mediaList as MediaQueryList;
}

/** Install the browser media-query fixture for a hook test. */
export function installMatchMedia(currentWindow: Window = window): void {
  Object.defineProperty(currentWindow, 'matchMedia', {
    configurable: true,
    /** Bind each media query to the selected browser window. */
    value: (query: string) => fakeMatchMedia(query, currentWindow),
  });
}

/** Set the initial font size used to resolve rem-based media queries. */
export function setMediaRootFontSize(size: number): void {
  mediaRootFontSize = size;
}

/** Set the viewport width and notify the responsive hook. */
export function setViewportWidth(width: number, currentWindow: Window = window): void {
  Object.defineProperty(currentWindow, 'innerWidth', { configurable: true, value: width });
  for (const list of mediaLists) list.dispatchEvent(new Event('change'));
}

/** Restore the browser fixture after each responsive test. */
export function restoreViewport(): void {
  cleanup();
  if (originalWidth) Object.defineProperty(window, 'innerWidth', originalWidth);
  if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
  else Reflect.deleteProperty(window, 'matchMedia');
  mediaLists.clear();
  mediaRootFontSize = 16;
}
