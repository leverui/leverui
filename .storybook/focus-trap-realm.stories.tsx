import { createSignal, onSettled, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { FocusTrap } from '../src';
import type { GetChildProps } from '../src/styled-system/child-props';

/** Exercise a valid HTML root created by another document's window. */
function FocusTrapRealmExample(): JSX.Element {
  const [ready, setReady] = createSignal(false);
  const [active, setActive] = createSignal(false);
  let frame: HTMLIFrameElement | undefined;

  /** Keep the source document alive after its iframe mounts. */
  function captureFrame(element: HTMLIFrameElement): void {
    frame = element;
  }

  /** Render the foreign article only after the iframe document exists. */
  function markReady(): void {
    setReady(true);
  }

  /** Enable the existing cross-document focus trap. */
  function openTrap(): void {
    setActive(true);
  }

  /** Release focus and restore the launcher. */
  function closeTrap(): void {
    setActive(false);
  }

  /** Return a caller-owned native article from the iframe's DOM realm. */
  function renderForeignArticle(getProps: GetChildProps): JSX.Element {
    const source = frame?.contentDocument;
    if (!source) throw new Error('The cross-document source is unavailable.');
    const article = source.createElement('article');
    const input = source.createElement('input');
    const close = source.createElement('button');
    input.setAttribute('aria-label', 'Cross-document input');
    input.setAttribute('data-autofocus', '');
    close.textContent = 'End cross-document trap';
    close.addEventListener('click', closeTrap);
    article.append(input, close);
    const props = getProps();
    article.className = typeof props.class === 'string' ? props.class : '';
    article.dataset.testid = 'cross-document-root';
    article.dataset.foreignRealm = String(!(article instanceof HTMLElement));
    props.ref?.(article);
    return article;
  }

  onSettled(markReady);

  return (
    <>
      <iframe ref={captureFrame} title="Cross-document source" hidden />
      <button type="button" data-testid="cross-document-launcher" onClick={openTrap}>
        Start cross-document trap
      </button>
      <Show when={ready()}>
        <FocusTrap disabled={!active()} asChild={renderForeignArticle} />
      </Show>
    </>
  );
}

const meta = {
  title: 'Components/Focus Trap Realm',
  component: FocusTrapRealmExample,
} satisfies Meta<typeof FocusTrapRealmExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
