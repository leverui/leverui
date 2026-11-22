import { Radiomark, type RadiomarkProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<RadiomarkProps<'span'>['asChild']>>[0];

/** Record the installed Radiomark's native span ref. */
function markSpan(element: HTMLSpanElement): void {
  element.dataset.markRef = element.tagName.toLowerCase();
}

/** Compose a caller-owned span with the installed mark's attributes. */
function renderOwnedMark(getProps: GetChildProps): JSX.Element {
  return <span {...getProps()} id="packed-radiomark-owned" />;
}

/** Exercise public state, refs, composition, and reactive appearance options. */
export function PackedRadiomark(): JSX.Element {
  const [active, setActive] = createSignal(false);

  /** Change the installed mark without replacing its native span. */
  function toggleMark(): void {
    setActive(!active());
  }

  return (
    <>
      <Radiomark
        id="packed-radiomark"
        data-custom-mark=""
        ref={markSpan}
        checked={active()}
        disabled={active()}
        size={active() ? 'lg' : 'xs'}
        colorPalette="teal"
      />
      <Radiomark checked asChild={renderOwnedMark} variant="outline" filled />
      <button type="button" id="packed-radiomark-toggle" onClick={toggleMark}>
        Change Radiomark
      </button>
    </>
  );
}
