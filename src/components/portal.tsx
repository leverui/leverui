import {
  children,
  createEffect,
  createMemo,
  onSettled,
  Show,
  createSignal,
  type Accessor,
  type ParentProps,
} from 'solid-js';
import { type JSX } from '@solidjs/web';
import { isServer, Portal as SolidPortal } from '@solidjs/web';
import { useEnvironmentContext, type RootNode } from './environment';
import { useOverlayOpen } from './portal-overlay-context';

export interface PortalProps extends ParentProps {
  /** Keep children at their declaration site instead of moving them. */
  disabled?: boolean | undefined;
  /** Mount in this element; use an accessor when the destination can change. */
  container?: HTMLElement | Accessor<HTMLElement | null | undefined> | null | undefined;
  /** Solid portal destination; takes priority over container when both are supplied. */
  mount?: Node | undefined;
}

/** Preserve server content through hydration before moving it into a portal. */
export function Portal(props: PortalProps): JSX.Element {
  const [mounted, setMounted] = createSignal(false);
  const content = children(() => props.children);
  const environment = useEnvironmentContext();
  const overlayOpen = useOverlayOpen();
  const [bridge, setBridge] = createSignal<HTMLDivElement>();

  /** Choose the nearest shadow root or owning document body. */
  function defaultMount(): Node {
    const rootNode: RootNode = environment().getRootNode().getRootNode();
    return rootNode.nodeType === 11 && 'host' in rootNode
      ? rootNode
      : environment().getDocument().body;
  }

  /** Resolve an explicit destination before falling back to the environment. */
  function portalDestination(): Node {
    const mount = props.mount;
    if (mount !== undefined) return mount;
    const container = props.container;
    const selected = typeof container === 'function' ? container() : container;
    return selected ?? defaultMount();
  }

  /**
   * Solid 2's Portal mounts into an element. A shadow root or other fragment
   * destination gets a layout-neutral container element appended to it.
   */
  const portalMount = createMemo((): Element | undefined => {
    // Effect computes run during server rendering too; the destination is client-only.
    // Resolve it after this portal settles: Solid 2 runs refs before elements are
    // attached, so an environment root captured by a ref may still be detached.
    if (isServer || !mounted()) return undefined;
    const destination = portalDestination();
    if (destination instanceof Element) return destination;
    const container = environment().getDocument().createElement('div');
    container.style.display = 'contents';
    container.setAttribute('data-lui-portal-container', '');
    return container;
  });

  createEffect(
    /** Track the destination and its container element. */
    () =>
      isServer || !mounted()
        ? undefined
        : { destination: portalDestination(), container: portalMount() },
    /** Attach a fragment destination's container while it is in use. */
    (current) => {
      if (!current) return;
      const { destination, container } = current;
      if (!container || destination === container) return;
      destination.appendChild(container);
      return () => container.remove();
    },
  );

  /** Start portalling after Solid has matched the inline server children. */
  function enablePortal(): void {
    setMounted(true);
  }

  /** Keep the portal wrapper out of the destination's flex and grid layout. */
  function preserveDestinationLayout(element: HTMLDivElement): void {
    element.style.display = 'contents';
    setBridge(element);
  }

  onSettled(enablePortal);

  // The bridge restored for the current open period. A nested overlay opening
  // can rerun this effect; the outer bridge must then stay hidden.
  let restoredBridge: HTMLDivElement | undefined;

  createEffect(
    /** Track the bridge element while its owning overlay is open. */
    () => (overlayOpen?.() ? bridge() : undefined),
    /** Restore this portal's accessibility once when its owning overlay opens. */
    (element) => {
      if (!element) {
        restoredBridge = undefined;
        return;
      }
      if (element === restoredBridge) return;
      restoredBridge = element;
      let settledFrame: number | undefined;
      const frame = requestAnimationFrame(
        /** Follow Zag's deferred outside-tree hiding for the new overlay. */
        () => {
          settledFrame = requestAnimationFrame(
            /** Unhide only this overlay's own portal bridge. */
            () => {
              element.removeAttribute('aria-hidden');
              element.removeAttribute('data-aria-hidden');
            },
          );
        },
      );
      return (
        /** Cancel pending accessibility work when this overlay closes. */
        () => {
          cancelAnimationFrame(frame);
          if (settledFrame !== undefined) cancelAnimationFrame(settledFrame);
        }
      );
    },
  );

  return (
    <Show when={mounted() && !props.disabled} fallback={content()}>
      <SolidPortal mount={portalMount() ?? environment().getDocument().body}>
        <div ref={preserveDestinationLayout}>{content()}</div>
      </SolidPortal>
    </Show>
  );
}
