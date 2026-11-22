import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { groupsForPath } from '../lib/navigation-groups';
import '../styles/guide-navigation.css';

/** Navigate the current tab's guides, marking the active page. */
export function GuideNavigation(props: { activePath: string }): JSX.Element {
  return (
    <div class="guide-navigation">
      <For each={groupsForPath(props.activePath)}>
        {/** Render one titled group of links. */}
        {(group) => (
          <section class="guide-nav-section">
            <h2>{group.name}</h2>
            <nav aria-label={group.name}>
              <For each={group.links}>
                {/** Link one page, highlighting the current one. */}
                {(link) => (
                  <a href={link.path} class={{ active: link.path === props.activePath }}>
                    {link.label}
                  </a>
                )}
              </For>
            </nav>
          </section>
        )}
      </For>
    </div>
  );
}
