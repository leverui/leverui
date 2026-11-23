import { createEffect, createSignal, For, Loading, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { GuideExplorerConfig } from '../lib/guide-explorers';
import { GuideCodeBlock } from './guide-code-block';
import './guide-part-explorer.css';

const activeAttribute = 'data-guide-explorer-active';

/** Resolve the CSS selector that identifies one public part. */
function partSelector(config: GuideExplorerConfig, slug: string, part: string): string {
  return config.selectors?.[part] ?? `.leverui-${slug}__${part}`;
}

/** Show a copyable CSS hook for the selected public part. */
function explorerCode(config: GuideExplorerConfig, slug: string, part: string): string {
  return `/* Target the ${part} part from your own stylesheet. */
.my-${slug} ${partSelector(config, slug, part)} {
  outline: 2px solid var(--lui-colors-blue-500);
}`;
}

/** Inspect a maintained Storybook preview by its public CSS parts. */
export function GuidePartExplorer(props: {
  config: GuideExplorerConfig;
  slug: string;
}): JSX.Element {
  const [selected, setSelected] = createSignal<string | undefined>();
  const [hovered, setHovered] = createSignal<string | undefined>();
  const [mounted, setMounted] = createSignal(false);
  let preview: HTMLDivElement | undefined;

  /** Prefer transient pointer or keyboard focus over a persistent selection. */
  const highlighted = (): string | undefined => hovered() ?? selected();

  /** Select one part or clear the current selection. */
  function selectPart(part: string): void {
    setSelected((current) => (current === part ? undefined : part));
  }

  /** Remove the highlight marker from every previously highlighted element. */
  function clearHighlight(): void {
    preview
      ?.querySelectorAll(`[${activeAttribute}]`)
      .forEach((element) => element.removeAttribute(activeAttribute));
  }

  onSettled(
    /** Mount the interactive preview only in the browser, as guide examples do. */
    () => {
      setMounted(true);
    },
  );

  createEffect(
    /** Follow the highlighted part. */
    highlighted,
    /** Mark the rendered elements that belong to the highlighted part. */
    (part) => {
      clearHighlight();
      if (!part) return;
      preview
        ?.querySelectorAll(partSelector(props.config, props.slug, part))
        .forEach((element) => element.setAttribute(activeAttribute, ''));
    },
  );
  onSettled(
    /** Clear the highlight markers when the Explorer unmounts. */
    () => clearHighlight,
  );

  return (
    <div class="guide-part-explorer">
      <div class="guide-part-explorer-preview" ref={preview}>
        <Show when={mounted()}>
          <Loading>
            <props.config.Demo />
          </Loading>
        </Show>
      </div>
      <div class="guide-part-explorer-parts">
        <h2>Component Anatomy</h2>
        <p>Hover to highlight, click to select parts</p>
        <div role="group" aria-label={`${props.config.name} parts`}>
          <For each={props.config.parts}>
            {/** Give each public part a keyboard-reachable selector. */}
            {(part) => (
              <button
                type="button"
                aria-pressed={selected() === part ? 'true' : 'false'}
                onClick={
                  /** Keep the chosen part highlighted. */
                  () => selectPart(part)
                }
                onMouseEnter={
                  /** Preview the part beneath the pointer. */
                  () => setHovered(part)
                }
                onMouseLeave={
                  /** Restore the selected part when the pointer leaves. */
                  () => setHovered(undefined)
                }
                onFocus={
                  /** Preview the part reached by keyboard focus. */
                  () => setHovered(part)
                }
                onBlur={
                  /** Restore the selection when focus leaves. */
                  () => setHovered(undefined)
                }
              >
                {part}
              </button>
            )}
          </For>
        </div>
      </div>
      <Show when={selected()}>
        {/** Show the CSS hook only once a part is selected. */}
        {(part) => (
          <div class="guide-part-explorer-code">
            <GuideCodeBlock
              label={`${props.slug}.css`}
              source={explorerCode(props.config, props.slug, part())}
            />
          </div>
        )}
      </Show>
    </div>
  );
}
