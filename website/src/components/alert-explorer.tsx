import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AlertExplorerDemo } from '../../../demos/examples/alert-standard';
import { alertExplorerCode, alertParts, type AlertPart } from '../lib/alert-explorer-code';
import { GuideCodeBlock } from './guide-code-block';
import './alert-explorer.css';

/** Inspect the maintained Storybook Alert preview by its public parts. */
export function AlertExplorer(): JSX.Element {
  const [selected, setSelected] = createSignal<AlertPart | undefined>();
  const [hovered, setHovered] = createSignal<AlertPart | undefined>();
  /** Prefer transient pointer or keyboard focus over a persistent selection. */
  const highlighted = (): AlertPart | undefined => hovered() ?? selected();

  /** Select one part or clear the current selection. */
  function selectPart(part: AlertPart): void {
    setSelected((current) => (current === part ? undefined : part));
  }

  return (
    <div class="alert-explorer" data-highlight-part={highlighted()}>
      <div class="alert-explorer-preview">
        <AlertExplorerDemo />
      </div>
      <div class="alert-explorer-parts">
        <h2>Component Anatomy</h2>
        <p>Hover to highlight, click to select parts</p>
        <div role="group" aria-label="Alert parts">
          <For each={alertParts}>
            {/** Give each native part a keyboard-reachable selector. */}
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
          <div class="alert-explorer-code">
            <GuideCodeBlock label="alert.css" source={alertExplorerCode(part())} />
          </div>
        )}
      </Show>
    </div>
  );
}
