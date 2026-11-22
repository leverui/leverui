import { For, Show, onSettled, createSignal, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createOverlayStore, type CreateOverlayProps, type OverlayProps } from './overlay-store';

export type { CreateOverlayProps } from './overlay-store';

export interface OverlayOptions<TProps extends object> {
  props?: Partial<TProps>;
}

/** Public controller contract for one Solid overlay renderer. */
export interface CreateOverlayReturn<TProps extends object, TReturn> {
  Viewport: Component;
  open: (id: string, props: TProps) => Promise<TReturn | undefined>;
  close: (id: string, value?: TReturn) => Promise<void>;
  update: (id: string, props: Partial<TProps>) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  get: (id: string) => OverlayProps<TProps, TReturn>;
  has: (id: string) => boolean;
  getSnapshot: () => Array<OverlayProps<TProps, TReturn>>;
  waitForExit: (id: string) => Promise<void>;
}

/** Create an imperative overlay controller with a reactive Solid viewport. */
export function createOverlay<TProps extends object, TReturn = unknown>(
  Component: Component<TProps & CreateOverlayProps<TReturn>>,
  options?: OverlayOptions<TProps>,
): CreateOverlayReturn<TProps, TReturn> {
  const store = createOverlayStore<TProps, TReturn>(options?.props);

  /** Render one entry, suppressing its open state until client mounting. */
  function ViewportItem(props: { entry: ReturnType<typeof store.snapshot>[number] }): JSX.Element {
    const [mounted, setMounted] = createSignal(false);
    onSettled(
      /** Begin the overlay transition after the client has mounted. */
      () => {
        setMounted(true);
      },
    );
    return (
      <Show when={mounted()}>
        <Component {...props.entry.props()} />
      </Show>
    );
  }

  /** Render every active overlay in insertion order. */
  function Viewport(): JSX.Element {
    return (
      <For each={store.snapshot()}>
        {
          /** Keep each item mounted until its exit completes. */
          (entry) => <ViewportItem entry={entry} />
        }
      </For>
    );
  }

  return {
    Viewport,
    open: store.open,
    close: store.close,
    update: store.update,
    remove: store.remove,
    removeAll: store.removeAll,
    get: store.get,
    has: store.has,
    getSnapshot: store.getSnapshot,
    waitForExit: store.waitForExit,
  };
}
