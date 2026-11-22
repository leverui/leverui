import { createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { loadGuideStories } from '../lib/guide-stories';
import {
  scrollAreaExplorerCode,
  scrollAreaParts,
  type ScrollAreaPart,
} from '../lib/scroll-area-explorer-code';
import { GuideCodeBlock } from './guide-code-block';
import { SiteIcon } from './site-icon';
import './scroll-area-explorer.css';
import './scroll-area-explorer-mobile.css';

/** Explore the maintained Storybook Scroll Area renderer by its public parts. */
export function ScrollAreaExplorer(): JSX.Element {
  const [renderPreview, setRenderPreview] = createSignal<(() => JSX.Element) | undefined>();
  const [failed, setFailed] = createSignal(false);
  const [selected, setSelected] = createSignal<ScrollAreaPart | undefined>();
  const [hovered, setHovered] = createSignal<ScrollAreaPart | undefined>();
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(false);
  let partStrip: HTMLDivElement | undefined;
  /** Prefer the focused or hovered part before returning to the selection. */
  const highlighted = () => hovered() ?? selected();

  /** Select a part or clear it when the same part is chosen again. */
  function selectPart(part: ScrollAreaPart): void {
    setSelected((current) => (current === part ? undefined : part));
  }

  /** Keep mobile scroll controls aligned with the anatomy strip's position. */
  function updatePartScroll(): void {
    if (!partStrip) return;
    setCanScrollLeft(partStrip.scrollLeft > 1);
    setCanScrollRight(partStrip.scrollLeft + partStrip.clientWidth < partStrip.scrollWidth - 1);
  }

  /** Move the anatomy strip by one group of parts. */
  function scrollParts(direction: -1 | 1): void {
    partStrip?.scrollBy({ left: direction * 100, behavior: 'smooth' });
  }

  onSettled(
    /** Recalculate the strip controls when the viewport changes. */
    () => {
      updatePartScroll();
      window.addEventListener('resize', updatePartScroll);
      return (
        /** Release the viewport listener with the Explorer. */
        () => window.removeEventListener('resize', updatePartScroll)
      );
    },
  );

  onSettled(
    /** Load the same Basic renderer Storybook uses after client hydration. */
    () => {
      let active = true;
      void loadGuideStories('scroll-area').then(
        /** Keep the mounted explorer bound to Storybook's maintained source. */
        (stories) => {
          if (!active) return;
          const basic = stories.find(
            /** Select the Basic story already used above in the guide. */
            (story) => story.id === 'Basic',
          );
          if (basic) setRenderPreview(() => basic.render);
          else setFailed(true);
        },
        /** Surface a missing story chunk instead of showing a permanent spinner. */
        () => {
          if (active) setFailed(true);
        },
      );
      return (
        /** Ignore an example module that resolves after navigation. */
        () => {
          active = false;
        }
      );
    },
  );

  return (
    <div class="scroll-area-explorer" data-highlight-part={highlighted()}>
      <div class="scroll-area-explorer-preview">
        <Show
          when={renderPreview()}
          fallback={
            <p role="status">
              {failed() ? 'The Scroll Area explorer could not load.' : 'Loading explorer…'}
            </p>
          }
        >
          {/** Render the exact Basic Storybook component. */}
          {(render) => <>{render()()}</>}
        </Show>
      </div>
      <div class="scroll-area-explorer-parts">
        <h2>Component Anatomy</h2>
        <p>Hover to highlight, click to select parts</p>
        <div class="scroll-area-explorer-part-strip">
          <div
            ref={partStrip}
            role="group"
            aria-label="Scroll Area parts"
            onScroll={updatePartScroll}
          >
            <For each={scrollAreaParts}>
              {/** Offer every public part for pointer and keyboard inspection. */}
              {(part) => (
                <button
                  type="button"
                  aria-pressed={selected() === part ? 'true' : 'false'}
                  onClick={
                    /** Keep the chosen part highlighted. */
                    () => selectPart(part)
                  }
                  onMouseEnter={
                    /** Preview the part under the pointer. */
                    () => setHovered(part)
                  }
                  onMouseLeave={
                    /** Return to the selected part after pointer exit. */
                    () => setHovered(undefined)
                  }
                  onFocus={
                    /** Preview the part reached by keyboard focus. */
                    () => setHovered(part)
                  }
                  onBlur={
                    /** Restore the selected part after focus leaves. */
                    () => setHovered(undefined)
                  }
                >
                  {part[0]?.toUpperCase()}
                  {part.slice(1)}
                  <span class="scroll-area-part-indicator" aria-hidden="true" />
                </button>
              )}
            </For>
          </div>
          <Show when={canScrollLeft()}>
            <button
              class="scroll-area-explorer-scroll-control is-left"
              type="button"
              aria-label="Scroll parts left"
              onClick={
                /** Reveal earlier anatomy parts. */
                () => scrollParts(-1)
              }
            >
              <SiteIcon name="arrow-left" />
            </button>
          </Show>
          <Show when={canScrollRight()}>
            <button
              class="scroll-area-explorer-scroll-control is-right"
              type="button"
              aria-label="Scroll parts right"
              onClick={
                /** Reveal later anatomy parts. */
                () => scrollParts(1)
              }
            >
              <SiteIcon name="arrow-right" />
            </button>
          </Show>
        </div>
      </div>
      <Show when={selected()}>
        {/** Show the CSS hook only once a part is selected. */}
        {(part) => (
          <div class="scroll-area-explorer-code">
            <GuideCodeBlock label="scroll-area.css" source={scrollAreaExplorerCode(part())} />
          </div>
        )}
      </Show>
    </div>
  );
}
