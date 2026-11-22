import { createSignal, Errored, For, isHydrating, onSettled, Show, untrack } from 'solid-js';
import { isServer, type JSX } from '@solidjs/web';
import { componentOverviewCards } from '../lib/component-overview';
import { overviewDemos } from './overview-demos/index';
import '../styles/concept-overview.css';

/** How many demos are built during a switch to this page: about one screen of cards. */
const firstScreen = 12;
/** How many more demos are built on each later frame. */
const batchSize = 16;

/** Link to every public component guide as a grid of cards, each with a small demo. */
export function ConceptOverviewGrid(): JSX.Element {
  const total = componentOverviewCards.length;
  // A prebuilt page already holds every demo, so the browser keeps them all. A switch from
  // another page builds the first screen at once and the rest in batches right after, so the
  // switch does not wait on demos that are off screen.
  const [shown, setShown] = createSignal(isServer || isHydrating() ? total : firstScreen);

  onSettled(
    /** Build the remaining demos a batch per frame once the page is on screen. */
    () => {
      if (untrack(shown) >= total) return undefined;
      let frame = requestAnimationFrame(
        /** Add one batch, then ask for another frame until every demo is built. */
        function grow() {
          const next = Math.min(untrack(shown) + batchSize, total);
          setShown(next);
          if (next < total) frame = requestAnimationFrame(grow);
        },
      );
      return (
        /** Stop adding demos when the page is left. */
        () => cancelAnimationFrame(frame)
      );
    },
  );

  return (
    <div class="concept-overview-grid">
      <For each={componentOverviewCards}>
        {/** Show one component's name, linked to its guide, above its demo. */}
        {(card, index) => (
          <div class="concept-overview-card">
            <a href={card.href}>{card.title}</a>
            {/**
             * The demo only illustrates the component, so it takes no input or focus. The box
             * is always there at full size, so cards do not move as their demos arrive.
             */}
            <div class="concept-overview-preview" inert aria-hidden="true">
              <Show
                when={index() < shown() ? overviewDemos[card.href.split('/').at(-1) ?? ''] : false}
                keyed
              >
                {/**
                 * Its own error boundary keeps one broken demo from taking the page down or
                 * holding up the switch to this page.
                 */}
                {(Demo) => (
                  <Errored fallback={undefined}>
                    <Demo />
                  </Errored>
                )}
              </Show>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
