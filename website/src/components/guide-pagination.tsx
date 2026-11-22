import { createMemo, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Guide } from '../lib/docs';
import { findGuide } from '../lib/docs';
import { sidebarPages } from '../lib/navigation-groups';
import { HStack, Stack, Text } from '@leverui/components';
import { SiteIcon } from './site-icon';
import '../styles/guide-pagination.css';

interface PageNeighbors {
  readonly previous?: Guide | undefined;
  readonly next?: Guide | undefined;
}

/** Find a published guide for a position in the page sequence. */
function guideAt(index: number): Guide | undefined {
  const path = sidebarPages[index]?.path;
  return path ? findGuide(path) : undefined;
}

/** Find neighboring pages in the sidebar's order across all tabs. */
export function pageNeighbors(guide: Guide): PageNeighbors {
  const index = sidebarPages.findIndex(
    /** Match the current page's sidebar link. */
    (page) => page.path === guide.path,
  );
  if (index < 0) return {};
  return { previous: guideAt(index - 1), next: guideAt(index + 1) };
}

/** Whether a guide belongs to the paginated documentation sequence. */
export function hasPageNeighbors(guide: Guide): boolean {
  return sidebarPages.some(
    /** Match the current page's sidebar link. */
    (page) => page.path === guide.path,
  );
}

/** Name a neighboring page as the sidebar does. */
function pageTitle(guide: Guide): string {
  return (
    sidebarPages.find(
      /** Match the neighbor's sidebar link. */
      (page) => page.path === guide.path,
    )?.label ?? guide.title
  );
}

/** Link to the adjacent sidebar pages after the guide content. */
export function GuidePagination(props: { guide: Guide }): JSX.Element {
  const neighbors = createMemo(
    /** Update links when client-side navigation changes the guide. */
    () => pageNeighbors(props.guide),
  );
  return (
    <nav class="guide-pagination" aria-label="Documentation pages">
      <Show when={neighbors().previous} fallback={<span />}>
        {/** Show the preceding sidebar page. */}
        {(previous) => (
          <a href={previous().path} class="guide-pagination-card">
            <Stack gap="1" textStyle="sm">
              <Text class="guide-pagination-label">Previous</Text>
              <HStack gap="2" class="guide-pagination-title">
                <SiteIcon name="chevron-left" />
                {pageTitle(previous())}
              </HStack>
            </Stack>
          </a>
        )}
      </Show>
      <Show when={neighbors().next} fallback={<span />}>
        {/** Show the following sidebar page. */}
        {(next) => (
          <a href={next().path} class="guide-pagination-card is-next">
            <Stack gap="1" textStyle="sm">
              <Text class="guide-pagination-label">Next</Text>
              <HStack gap="2" justify="flex-end" class="guide-pagination-title">
                {pageTitle(next())}
                <SiteIcon name="chevron-right" />
              </HStack>
            </Stack>
          </a>
        )}
      </Show>
    </nav>
  );
}
