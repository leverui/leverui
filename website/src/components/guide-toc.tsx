import { Drawer, Portal, type DrawerOpenChangeDetails } from '@leverui/components';
import { useLocation, useNavigate } from '@solidjs/router';
import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createGuideTocSections, type GuideTocSource } from '../lib/guide-toc-sections';
import { SiteIcon } from './site-icon';

/** Open a slide-out list of the guide's sections and jump to the one chosen. */
export function GuideToc(props: GuideTocSource): JSX.Element {
  const sections = createGuideTocSections(props);
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);
  let pendingSection: string | undefined;

  /** Follow the drawer's trigger, backdrop, close button, and Escape key. */
  function updateOpen(details: DrawerOpenChangeDetails): void {
    setOpen(details.open);
  }

  /** Close the drawer first so its scroll lock cannot undo the jump. */
  function chooseSection(event: MouseEvent, id: string): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    pendingSection = id;
    setOpen(false);
  }

  /** Scroll to the chosen heading once the drawer has closed and returned focus. */
  function scrollToPendingSection(): void {
    const id = pendingSection;
    pendingSection = undefined;
    if (!id) return;
    navigate(`${location.pathname}#${id}`, { scroll: false });
    requestAnimationFrame(
      /** Start after focus returns to the trigger, which would cancel a smooth scroll. */
      () => document.getElementById(id)?.scrollIntoView(),
    );
  }

  return (
    <Show when={sections().length > 0}>
      <Drawer.Root
        open={open()}
        onOpenChange={updateOpen}
        onExitComplete={scrollToPendingSection}
        placement="end"
        size="xs"
      >
        <Drawer.Trigger class="guide-toc-trigger">
          <SiteIcon name="list" />
          <span>On this page</span>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content class="guide-toc-drawer">
              <Drawer.Header>
                <Drawer.Title>On this page</Drawer.Title>
              </Drawer.Header>
              <Drawer.CloseTrigger class="guide-toc-close" aria-label="Close">
                <SiteIcon name="x-lg" />
              </Drawer.CloseTrigger>
              <Drawer.Body>
                <nav class="guide-toc" aria-label="On this page">
                  <For each={sections()}>
                    {/** Link to one rendered heading and close the drawer when chosen. */}
                    {(section) => (
                      <a
                        href={`#${section.id}`}
                        class={{ nested: section.depth === 3 }}
                        onClick={
                          /** Jump to this heading after the drawer closes. */
                          (event) => chooseSection(event, section.id)
                        }
                      >
                        {section.title.replace(/[`*]/g, '')}
                      </a>
                    )}
                  </For>
                </nav>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Show>
  );
}
