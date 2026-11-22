import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Kbd as KbdExport, KbdPropsProvider as KbdProviderExport } from '../src';

export interface KbdHydrationComponents {
  Kbd: typeof KbdExport;
  KbdPropsProvider: typeof KbdProviderExport;
}

/** Render identical JSX Kbd content through server and browser entries. */
export function renderKbdHydrationTree({
  Kbd,
  KbdPropsProvider,
}: KbdHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Create one fresh shared label for this Kbd instance. */
  function renderSharedKey(): JSX.Element {
    return <span id="hydrated-shared-child">Enter</span>;
  }

  /** Change provider size while keeping Kbd nodes mounted. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <KbdPropsProvider value={{ size: large() ? 'lg' : 'sm', children: renderSharedKey }}>
        <Kbd id="hydrated-key">
          <span id="hydrated-local-child">Esc</span>
        </Kbd>
        <Kbd id="hydrated-shared-key" />
        <Kbd as="span" id="hydrated-selected-key">
          ⌘
        </Kbd>
        <Kbd size={{ base: 'sm', md: 'lg' }} id="hydrated-responsive-key">
          Shift
        </Kbd>
        <button type="button" id="kbd-hydration-toggle" onClick={toggleSize}>
          Toggle size
        </button>
      </KbdPropsProvider>
    </>
  );
}
