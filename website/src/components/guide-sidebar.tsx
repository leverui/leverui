import { ScrollArea } from '@leverui/components';
import { createEffect } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GuideNavigation } from './guide-navigation';

/** Reveal the selected guide without moving the document itself. */
function revealActiveGuide(viewport: HTMLDivElement): void {
  const active = viewport.querySelector<HTMLAnchorElement>('a.active');
  if (!active) return;
  const viewportRect = viewport.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const visibleTop = Math.max(viewportRect.top, 0);
  const visibleBottom = Math.min(viewportRect.bottom, window.innerHeight);
  if (activeRect.top >= visibleTop + 12 && activeRect.bottom <= visibleBottom - 12) return;
  const visibleHeight = Math.max(visibleBottom - visibleTop, 0);
  viewport.scrollTop += activeRect.top - visibleTop - visibleHeight / 2;
}

/** Keep the desktop documentation navigation in a dedicated scroll viewport. */
export function GuideSidebar(props: { activePath: string }): JSX.Element {
  let viewport: HTMLDivElement | undefined;

  createEffect(
    /** Follow the active route after its navigation link updates. */
    () => props.activePath,
    /** Scroll the active link into the sidebar viewport. */
    (activePath) => {
      if (viewport && activePath) revealActiveGuide(viewport);
    },
  );

  return (
    <aside class="guide-sidebar" aria-label="Documentation navigation">
      <ScrollArea.Root class="guide-sidebar-scroll-area" size="sm" variant="hover">
        <ScrollArea.Viewport ref={viewport} class="guide-sidebar-viewport">
          <ScrollArea.Content class="guide-sidebar-content">
            <GuideNavigation activePath={props.activePath} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </aside>
  );
}
