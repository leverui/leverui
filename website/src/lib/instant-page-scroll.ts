const interactions = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/** Hand scrolling back to the stylesheet's smooth setting. */
function restoreSmoothScroll(): void {
  document.documentElement.style.removeProperty('scroll-behavior');
  for (const name of interactions) window.removeEventListener(name, restoreSmoothScroll, true);
}

/** Make the next scroll instant, until the reader does something on the new page. */
function pauseSmoothScroll(): void {
  document.documentElement.style.scrollBehavior = 'auto';
  for (const name of interactions) {
    window.addEventListener(name, restoreSmoothScroll, { capture: true, passive: true });
  }
}

/**
 * Pause smooth scrolling when a click on a link opens another page of the site. The router
 * handles the click itself, so its default is already prevented and is not a reason to skip.
 */
function pauseForPageLink(event: MouseEvent): void {
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return;
  const url = new URL(link.href);
  if (url.origin === location.origin && url.pathname !== location.pathname) pauseSmoothScroll();
}

/**
 * The site scrolls smoothly inside a page, but a new page should start at the top at once, and
 * Back should return to the old place at once. Smooth scrolling pauses for those jumps and comes
 * back at the reader's next action. Returns a function that stops listening.
 */
export function listenForPageChanges(): () => void {
  document.addEventListener('click', pauseForPageLink, true);
  window.addEventListener('popstate', pauseSmoothScroll);
  return (
    /** Stop listening. */
    () => {
      document.removeEventListener('click', pauseForPageLink, true);
      window.removeEventListener('popstate', pauseSmoothScroll);
    }
  );
}
