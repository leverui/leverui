import { createSignal, type Accessor, type Setter } from 'solid-js';

/** Props supplied to an overlay renderer to control its lifecycle. */
export interface CreateOverlayProps<TReturn = unknown> {
  open?: boolean;
  onOpenChange?: (event: { open: boolean }) => void;
  onExitComplete?: () => void;
  setReturnValue?: (value: TReturn | undefined) => void;
  setExitComplete?: () => void;
}

export type OverlayProps<TProps extends object, TReturn> = TProps & CreateOverlayProps<TReturn>;

export interface OverlayEntry<TProps extends object, TReturn> {
  id: string;
  props: Accessor<OverlayProps<TProps, TReturn>>;
  setProps: Setter<OverlayProps<TProps, TReturn>>;
  resolveOpen: (value: TReturn | undefined) => void;
  resolveExit?: () => void;
  exitPromise?: Promise<void>;
}

/** Keep overlay state and promises independent of a specific Solid viewport. */
export function createOverlayStore<TProps extends object, TReturn>(defaults?: Partial<TProps>) {
  const entries = new Map<string, OverlayEntry<TProps, TReturn>>();
  const [snapshot, setSnapshot] = createSignal<OverlayEntry<TProps, TReturn>[]>([]);

  /** Publish an immutable snapshot to every mounted viewport. */
  function publish(): void {
    setSnapshot([...entries.values()]);
  }

  /** Resolve outstanding callers when an entry disappears without an exit event. */
  function settle(entry: OverlayEntry<TProps, TReturn>): void {
    entry.resolveOpen(undefined);
    entry.resolveExit?.();
  }

  /** Remove one overlay after its close animation or an explicit removal. */
  function remove(id: string): void {
    const entry = entries.get(id);
    if (!entry) return;
    settle(entry);
    entries.delete(id);
    publish();
  }

  /** Open or replace an overlay and resolve when it closes with a value. */
  function open(id: string, props: TProps): Promise<TReturn | undefined> {
    remove(id);
    return new Promise<TReturn | undefined>(
      /** Save the pending result with this overlay entry. */
      (resolveOpen) => {
        /** Close when the rendered Dialog or Drawer changes to its closed state. */
        function onOpenChange(event: { open: boolean }): void {
          if (!event.open && entries.get(id) === entry) void close(id);
        }
        const merged = { ...defaults, ...props } as TProps;
        /** Remove only this entry when its exit animation completes. */
        function onExitComplete(): void {
          if (entries.get(id) !== entry) return;
          entry.resolveExit?.();
          remove(id);
        }
        /** Supply a return value when a custom renderer closes itself. */
        function setReturnValue(value: TReturn | undefined): void {
          if (entries.get(id) === entry) entry.resolveOpen(value);
        }
        /** Settle callers waiting for this entry's exit animation. */
        function setExitComplete(): void {
          if (entries.get(id) === entry) entry.resolveExit?.();
        }
        const [currentProps, setProps] = createSignal<OverlayProps<TProps, TReturn>>(() => ({
          ...merged,
          open: true,
          onOpenChange,
          onExitComplete,
          setReturnValue,
          setExitComplete,
        }));
        const entry: OverlayEntry<TProps, TReturn> = {
          id,
          resolveOpen,
          props: currentProps,
          setProps,
        };
        entries.set(id, entry);
        publish();
      },
    );
  }

  /** Close an overlay, settle its result, and wait for its exit callback. */
  function close(id: string, value?: TReturn): Promise<void> {
    const entry = getEntry(id);
    if (entry.exitPromise) return entry.exitPromise;
    entry.resolveOpen(value);
    entry.exitPromise = new Promise<void>(
      /** Save the completion callback until the overlay exits. */
      (resolveExit) => {
        entry.resolveExit = resolveExit;
      },
    );
    entry.setProps(
      /** Preserve the rendered props while ending this overlay. */
      (previous) => ({ ...previous, open: false }),
    );
    return entry.exitPromise;
  }

  /** Merge consumer props while retaining internal lifecycle callbacks. */
  function update(id: string, props: Partial<TProps>): void {
    const entry = getEntry(id);
    const safe = { ...props } as Partial<OverlayProps<TProps, TReturn>>;
    delete safe.open;
    delete safe.onOpenChange;
    delete safe.onExitComplete;
    delete safe.setReturnValue;
    delete safe.setExitComplete;
    entry.setProps(
      /** Retain internal lifecycle callbacks while merging consumer changes. */
      (previous) => ({ ...previous, ...safe }),
    );
  }

  /** Remove every overlay and settle any open or closing promises. */
  function removeAll(): void {
    for (const entry of entries.values()) settle(entry);
    entries.clear();
    publish();
  }

  /** Find a required entry and explain an invalid id to the caller. */
  function getEntry(id: string): OverlayEntry<TProps, TReturn> {
    const entry = entries.get(id);
    if (!entry) throw new Error(`[leverui] Overlay with id ${id} not found`);
    return entry;
  }

  /** Return the current renderer props for an overlay id. */
  function get(id: string): OverlayProps<TProps, TReturn> {
    return getEntry(id).props();
  }

  /** Check whether an overlay id is currently mounted or exiting. */
  function has(id: string): boolean {
    return entries.has(id);
  }

  /** Return renderer props in insertion order. */
  function getSnapshot(): Array<OverlayProps<TProps, TReturn>> {
    return [...entries.values()].map(
      /** Expose props without internal promise bookkeeping. */
      (entry) => entry.props(),
    );
  }

  /** Await the exit if one has begun for this id. */
  function waitForExit(id: string): Promise<void> {
    return entries.get(id)?.exitPromise ?? Promise.resolve();
  }

  return {
    snapshot: snapshot as Accessor<OverlayEntry<TProps, TReturn>[]>,
    open,
    close,
    update,
    remove,
    removeAll,
    get,
    has,
    getSnapshot,
    waitForExit,
  };
}
