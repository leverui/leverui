/** Restore trigger focus after a queued menu focus action races with Escape. */
export function createMenuEscapeFocusRef(
  readCallerRef: () => unknown,
  readTriggerId: () => string | undefined,
): (element: Element) => void {
  let content: Element | undefined;

  /** Repair only keyboard dismissal from this menu's own content. */
  function handleKeydown(event: Event): void {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Escape' || !content) return;
    if (!(event.target instanceof Element)) return;
    const nearestContent = event.target.closest('[data-menu-content]');
    if (nearestContent !== content) return;

    const closingContent = content;
    const document = closingContent.ownerDocument;
    const triggerId = readTriggerId();
    const trigger = triggerId ? document.getElementById(triggerId) : null;
    if (!(trigger instanceof HTMLElement)) return;

    requestAnimationFrame(
      /** Run after any focus action queued by the preceding arrow key. */
      () => {
        if (!trigger.isConnected) return;
        if (closingContent.isConnected && closingContent.getAttribute('data-state') !== 'closed') {
          return;
        }
        const active = document.activeElement;
        if (
          active === document.body ||
          active === document.documentElement ||
          active === closingContent
        ) {
          trigger.focus({ preventScroll: true });
        }
      },
    );
  }

  /** Attach the keyboard listener once per node and notify the caller's ref. */
  return function menuContentRef(element: Element): void {
    if (content !== element) {
      content?.removeEventListener('keydown', handleKeydown, true);
      content = element;
      element.addEventListener('keydown', handleKeydown, true);
    }
    const callerRef = readCallerRef();
    if (typeof callerRef === 'function') callerRef(element);
  };
}
