import { Accordion } from '@leverui/components';
import { createEffect, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SiteIcon } from './site-icon';
import { docsSection, docsTabs, type DocsSection } from '../lib/docs-sections';
import { sectionGroups } from '../lib/navigation-groups';
import '../styles/site-menu.css';

/** Show the whole site's navigation as one full-page panel on narrow screens. */
export function SiteMenu(props: {
  open: boolean;
  path: string;
  onNavigate: () => void;
}): JSX.Element {
  let panel: HTMLElement | undefined;

  /** The current address without a trailing slash, as the navigation links are written. */
  const route = () => props.path.replace(/(?!^)\/+$/, '');

  /** The section to open first: the current page's, or the first one outside the docs. */
  const currentSection = (): DocsSection =>
    route().startsWith('/docs') ? docsSection(route()) : 'get-started';

  createEffect(
    /** Follow the menu opening. */
    () => props.open,
    /** Bring the current page's link into view inside the panel. */
    (open) => {
      if (open) panel?.querySelector('a[aria-current="page"]')?.scrollIntoView({ block: 'center' });
    },
  );

  return (
    <nav
      ref={panel}
      id="site-menu"
      class={['site-menu', { open: props.open }]}
      aria-label="Site navigation"
    >
      <Show when={props.open}>
        <Accordion.Root collapsible defaultValue={[currentSection()]} size="lg">
          <For each={docsTabs}>
            {/** Render one section of the site with every page in it. */}
            {(tab) => (
              <Accordion.Item value={tab.section}>
                <Accordion.ItemTrigger class="site-menu-section">
                  {tab.label}
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody class="site-menu-groups">
                    <For each={sectionGroups(tab.section)}>
                      {/** Render one titled group of pages. */}
                      {(group) => (
                        <section>
                          <h2>{group.name}</h2>
                          <ul>
                            <For each={group.links}>
                              {/** Link one page, marking the current one. */}
                              {(link) => (
                                <li>
                                  <a
                                    href={link.path}
                                    aria-current={link.path === route() ? 'page' : undefined}
                                    onClick={props.onNavigate}
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              )}
                            </For>
                          </ul>
                        </section>
                      )}
                    </For>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            )}
          </For>
        </Accordion.Root>
        <a
          class="site-menu-external"
          href="https://github.com/leverui/leverui"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiteIcon name="github" />
          GitHub
        </a>
      </Show>
    </nav>
  );
}
