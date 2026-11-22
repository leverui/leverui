import { autoresizeTextarea } from '@zag-js/auto-resize';
import { createEffect, untrack } from 'solid-js';

type InlineSizing = { height: string; overflowY: string };
/** Resolve only the inline declarations that Zag mutates. */
function consumerSizing(
  control: HTMLTextAreaElement,
  style: unknown,
  initial: InlineSizing,
  hadStyle: boolean,
): InlineSizing {
  if (style === undefined) {
    return hadStyle ? { height: '', overflowY: '' } : initial;
  }
  const probe = control.ownerDocument.createElement('textarea');
  if (typeof style === 'string') probe.style.cssText = style;
  else {
    if (typeof style !== 'object' || style === null) {
      throw new TypeError('Textarea style must be a CSS string or object.');
    }
    const height: unknown = Reflect.get(style, 'height');
    if (typeof height === 'string' || typeof height === 'number') {
      probe.style.height = String(height);
    }
    const overflowY: unknown = Reflect.get(style, 'overflow-y') ?? Reflect.get(style, 'overflowY');
    if (typeof overflowY === 'string' || typeof overflowY === 'number') {
      probe.style.overflowY = String(overflowY);
    }
  }
  return { height: probe.style.height, overflowY: probe.style.overflowY };
}

/** Restore native DOM state that Zag's disposer leaves on the textarea. */
function connectAutoresize(
  control: HTMLTextAreaElement,
  enabled: () => boolean | undefined,
  style: () => unknown,
): () => void {
  const valueDescriptor = Object.getOwnPropertyDescriptor(control, 'value');
  const initial = { height: control.style.height, overflowY: control.style.overflowY };
  const hadStyle = untrack(style) !== undefined;
  const dispose = autoresizeTextarea(control);

  /** Return the control to its native value and inline style state. */
  function restoreNativeState(): void {
    if (valueDescriptor) Object.defineProperty(control, 'value', valueDescriptor);
    else Reflect.deleteProperty(control, 'value');
    const sizing = consumerSizing(control, style(), initial, hadStyle);
    control.style.height = sizing.height;
    control.style.overflowY = sizing.overflowY;
  }

  /** Stop observers and absorb resize frames already scheduled by Zag. */
  return function disconnectAutoresize(): void {
    dispose?.();
    restoreNativeState();
    let remainingFrames = 3;

    /** Restore once Zag's nested observer and resize frames have passed. */
    function settleQueuedFrames(): void {
      remainingFrames -= 1;
      if (remainingFrames > 0) {
        requestAnimationFrame(settleQueuedFrames);
        return;
      }
      if (!enabled()) restoreNativeState();
    }

    requestAnimationFrame(settleQueuedFrames);
  };
}

/** Follow the autoresize option and clean up Zag's DOM observers on change. */
export function useTextareaAutoresize(
  element: () => HTMLElement | undefined,
  enabled: () => boolean | undefined,
  style: () => unknown,
): void {
  createEffect(
    /** Track whether autoresize is on and which element it applies to. */
    () => (enabled() ? element() : undefined),
    /** Attach only to a native textarea after its ref has been assigned. */
    (control) => {
      if (!(control instanceof HTMLTextAreaElement)) return;
      return connectAutoresize(control, enabled, style);
    },
  );
}
