import { createEffect, onSettled, type Accessor } from 'solid-js';
import { createGroupItemSync, type GroupSkip } from './group-items';

/** Keep direct child positions current as Solid adds, removes, or skips items. */
export function useGroupItemBinding(
  skip: Accessor<GroupSkip | undefined>,
): (group: HTMLElement) => void {
  let element: HTMLElement | undefined;
  let observer: MutationObserver | undefined;
  const items = createGroupItemSync();

  /** Reindex without observing the attributes and styles written by the indexer. */
  function synchronize(): void {
    if (!element) return;
    observer?.disconnect();
    try {
      items.sync(element, skip());
    } finally {
      observer?.observe(element, { childList: true, subtree: true, attributes: true });
    }
  }

  onSettled(
    /** Watch changes to direct children and their attributes after mount. */
    () => {
      if (!element) return;
      observer = new MutationObserver(
        /** Ignore nested mutations that cannot affect direct child positions. */
        (records) => {
          const group = element;
          if (!group) return;
          if (
            records.some(
              /** Detect added children or changed direct child attributes. */
              (record) =>
                (record.type === 'childList' && record.target === group) ||
                (record.type === 'attributes' && record.target.parentNode === group),
            )
          ) {
            synchronize();
          }
        },
      );
      synchronize();
      return (
        /** Disconnect the observer when this group is disposed. */
        () => {
          observer?.disconnect();
          items.dispose();
        }
      );
    },
  );
  createEffect(
    /** Track the Solid skip predicate. */
    () => skip(),
    /** Reindex when the Solid skip predicate changes. */
    () => {
      synchronize();
    },
  );

  /** Capture the actual native root for later child synchronization. */
  function captureGroup(group: HTMLElement): void {
    if (element === group) return;
    element = group;
    if (observer) synchronize();
  }

  return captureGroup;
}
