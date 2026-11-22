import { Kbd, KbdPropsProvider, type KbdProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<KbdProps['asChild']>>[0];

/** Create a separate key label for every installed Kbd instance. */
function renderSharedKey(): JSX.Element {
  return <span class="packed-kbd-label">Esc</span>;
}

/** Record the selected native span through the installed public ref type. */
function markNativeSpan(element: HTMLSpanElement): void {
  element.dataset.refTag = element.tagName.toLowerCase();
}

/** Record the selected child button through Kbd's parent ref. */
function markParentRef(element: HTMLElement): void {
  element.dataset.parentRef = 'true';
}

/** Record the same child button through its own ref. */
function markChildRef(element: HTMLElement): void {
  element.dataset.childRef = 'true';
}

/** Apply published Kbd attributes to a consumer-owned button. */
function renderChildButton(getProps: GetChildProps): JSX.Element {
  return (
    <button {...getProps({ ref: markChildRef })} type="button" id="packed-kbd-child">
      ⌘
    </button>
  );
}

/** Exercise installed Kbd types, provider children, CSS, and live updates. */
export function PackedKbd(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change provider size without replacing its key elements. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <div>
      <Kbd id="packed-kbd-default" variant="raised" colorPalette="blue">
        F12
      </Kbd>
      <Kbd class="packed-kbd-custom" id="packed-kbd-custom">
        Custom
      </Kbd>
      <KbdPropsProvider
        value={{
          size: large() ? 'lg' : 'sm',
          variant: 'outline',
          class: 'provider-kbd',
          children: renderSharedKey,
        }}
      >
        <Kbd id="packed-kbd-first" />
        <Kbd id="packed-kbd-second" />
        <Kbd class="fixed-kbd" id="packed-kbd-fixed" size="md">
          Enter
        </Kbd>
        <Kbd as="span" ref={markNativeSpan} id="packed-kbd-span">
          Tab
        </Kbd>
      </KbdPropsProvider>
      <Kbd asChild={renderChildButton} ref={markParentRef} aria-label="Command key" />
      <button id="packed-kbd-toggle" type="button" onClick={toggleSize}>
        Change Kbd size
      </button>
    </div>
  );
}
