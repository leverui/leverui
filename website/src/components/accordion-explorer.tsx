import { createSignal, For, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AccordionExplorerDemo } from '../../../demos/examples/accordion-rich';
import {
  accordionExplorerCode,
  accordionParts,
  type AccordionPart,
} from '../lib/accordion-explorer-code';
import { GuideCodeBlock } from './guide-code-block';
import { SiteIcon } from './site-icon';
import './accordion-explorer.css';
import './accordion-explorer-mobile.css';

/** Inspect the maintained Storybook Accordion demo by its public parts. */
export function AccordionExplorer(): JSX.Element {
  const [selected, setSelected] = createSignal<AccordionPart | undefined>();
  const [hovered, setHovered] = createSignal<AccordionPart | undefined>();
  const [canScrollLeft, setCanScrollLeft] = createSignal(false);
  const [canScrollRight, setCanScrollRight] = createSignal(false);
  let partStrip: HTMLDivElement | undefined;
  /** Prefer the hovered or focused part before the persistent selection. */
  const highlighted = () => hovered() ?? selected();

  /** Select a part or clear an already selected one. */
  function selectPart(part: AccordionPart): void {
    setSelected((current) => (current === part ? undefined : part));
  }

  /** Keep the mobile scroll controls in sync with the anatomy strip. */
  function updatePartScroll(): void {
    if (!partStrip) return;
    setCanScrollLeft(partStrip.scrollLeft > 1);
    setCanScrollRight(partStrip.scrollLeft + partStrip.clientWidth < partStrip.scrollWidth - 1);
  }

  /** Move the anatomy strip toward another set of parts. */
  function scrollParts(direction: -1 | 1): void {
    partStrip?.scrollBy({ left: direction * 100, behavior: 'smooth' });
  }

  onSettled(
    /** Track viewport changes after the mobile anatomy strip mounts. */
    () => {
      updatePartScroll();
      window.addEventListener('resize', updatePartScroll);
      return (
        /** Release the listener with this Explorer. */
        () => window.removeEventListener('resize', updatePartScroll)
      );
    },
  );

  return (
    <div class="accordion-explorer" data-highlight-part={highlighted()}>
      <div class="accordion-explorer-preview">
        <AccordionExplorerDemo />
      </div>
      <div class="accordion-explorer-parts">
        <h2>Component Anatomy</h2>
        <p>Hover to highlight, click to select parts</p>
        <div class="accordion-explorer-part-strip">
          <div
            ref={partStrip}
            role="group"
            aria-label="Accordion parts"
            onScroll={updatePartScroll}
          >
            <For each={accordionParts}>
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
                  <span class="accordion-explorer-part-indicator" aria-hidden="true" />
                </button>
              )}
            </For>
          </div>
          <Show when={canScrollLeft()}>
            <button
              class="accordion-explorer-scroll-control is-left"
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
              class="accordion-explorer-scroll-control is-right"
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
          <div class="accordion-explorer-code">
            <GuideCodeBlock label="accordion.css" source={accordionExplorerCode(part())} />
          </div>
        )}
      </Show>
    </div>
  );
}
