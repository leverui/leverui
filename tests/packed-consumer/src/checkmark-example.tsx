import { Checkmark, type CheckmarkProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetChildProps = Parameters<NonNullable<CheckmarkProps<'svg'>['asChild']>>[0];

/** Record the installed Checkmark's native SVG ref. */
function markSvg(element: SVGSVGElement): void {
  element.dataset.checkmarkRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the Checkmark asChild parent. */
function markParentChildSvg(element: SVGSVGElement): void {
  element.dataset.checkmarkParentRef = element.tagName.toLowerCase();
}

/** Record the ref supplied by the caller-owned SVG. */
function markOwnedChildSvg(element: SVGSVGElement): void {
  element.dataset.checkmarkChildRef = element.tagName.toLowerCase();
}

/** Record the selected native span passed to a public Checkmark ref. */
function markSpan(element: HTMLSpanElement): void {
  element.dataset.checkmarkSpanRef = element.tagName.toLowerCase();
}

/** Render a caller-owned SVG with the installed Checkmark's merged props. */
function renderChildSvg(getProps: GetChildProps): JSX.Element {
  return (
    <svg
      {...getProps({ ref: markOwnedChildSvg })}
      id="packed-checkmark-child"
      viewBox="0 0 32 32"
    />
  );
}

/** Exercise mounted Checkmark state, native refs, and SVG child composition. */
export function PackedCheckmark(): JSX.Element {
  const [state, setState] = createSignal<'unchecked' | 'checked' | 'indeterminate'>('unchecked');

  /** Advance the visual state without replacing the installed SVG. */
  function cycleState(): void {
    setState(
      state() === 'unchecked' ? 'checked' : state() === 'checked' ? 'indeterminate' : 'unchecked',
    );
  }

  return (
    <>
      <Checkmark
        id="packed-checkmark"
        ref={markSvg}
        checked={state() === 'checked'}
        indeterminate={state() === 'indeterminate'}
        colorPalette="teal"
      />
      <Checkmark asChild={renderChildSvg} ref={markParentChildSvg} checked aria-label="Selected" />
      <Checkmark as="span" id="packed-checkmark-span" ref={markSpan} />
      <button id="packed-checkmark-cycle" type="button" onClick={cycleState}>
        Cycle Checkmark
      </button>
    </>
  );
}
