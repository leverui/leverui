import {
  elementScroll,
  observeElementOffset,
  observeElementRect,
  Virtualizer,
  type PartialKeys,
  type VirtualItem,
  type VirtualizerOptions,
} from '@tanstack/virtual-core';
import { createEffect, createSignal, merge, onSettled } from 'solid-js';

export type { Virtualizer };

export type CreateVirtualizerOptions<
  TScrollElement extends Element,
  TItemElement extends Element,
> = PartialKeys<
  VirtualizerOptions<TScrollElement, TItemElement>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

/**
 * A Solid 2 binding for TanStack Virtual's framework-neutral core, with the
 * same shape as `@tanstack/solid-virtual`, which targets Solid 1. Pass options
 * with getters to keep them reactive; `getVirtualItems()` and `getTotalSize()`
 * are tracked reads.
 */
export function createVirtualizer<TScrollElement extends Element, TItemElement extends Element>(
  options: CreateVirtualizerOptions<TScrollElement, TItemElement>,
): Virtualizer<TScrollElement, TItemElement> {
  const resolved = merge(
    { observeElementRect, observeElementOffset, scrollToFn: elementScroll },
    options,
  );
  const instance = new Virtualizer<TScrollElement, TItemElement>({ ...resolved });
  const [virtualItems, setVirtualItems] = createSignal<VirtualItem[]>(instance.getVirtualItems());
  const [totalSize, setTotalSize] = createSignal(instance.getTotalSize());

  /** Publish the instance's current range after it changes. */
  function publish(): void {
    setVirtualItems(instance.getVirtualItems());
    setTotalSize(instance.getTotalSize());
  }

  createEffect(
    /**
     * Read every option, and the scroll element itself, so a reactive getter
     * such as `count` or a scroll element that mounts later reruns this.
     */
    () => ({ options: { ...resolved }, scrollElement: resolved.getScrollElement() }),
    /** Apply the latest options and recompute the visible range. */
    ({ options: current }) => {
      instance.setOptions({
        ...current,
        /** Publish the new range, then call the caller's handler. */
        onChange: (changed, sync) => {
          changed._willUpdate();
          publish();
          current.onChange?.(changed, sync);
        },
      });
      instance._willUpdate();
      publish();
    },
  );

  onSettled(() => {
    const cleanup = instance._didMount();
    instance._willUpdate();
    publish();
    return cleanup;
  });

  return new Proxy(instance, {
    /** Serve the visible range and size from Solid signals. */
    get(target, property, receiver) {
      if (property === 'getVirtualItems') return () => virtualItems();
      if (property === 'getTotalSize') return () => totalSize();
      return Reflect.get(target, property, receiver);
    },
  });
}
