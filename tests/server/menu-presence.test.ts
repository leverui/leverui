import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  MenuContent as ContentExport,
  MenuPositioner as PositionerExport,
  MenuRoot as RootExport,
  MenuRootProvider as RootProviderExport,
  useMenu as UseMenuExport,
} from '../../src';

type ServerComponents = {
  MenuContent: typeof ContentExport;
  MenuPositioner: typeof PositionerExport;
  MenuRoot: typeof RootExport;
  MenuRootProvider: typeof RootProviderExport;
  useMenu: typeof UseMenuExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render one closed menu mode through the published server entry. */
function renderServerMenu(mode: 'root' | 'eager-root' | 'provider' | 'lazy-provider'): string {
  return renderToString(
    /** Create the menu under its active system context. */
    () => {
      /** Render the same content for every presence mode. */
      function menuParts(): JSX.Element {
        return createComponent(server.MenuPositioner, {
          /** Keep the surface under the primitive's presence context. */
          get children() {
            return createComponent(server.MenuContent, {
              id: 'server-menu-content',
              children: 'Menu body',
            });
          },
        });
      }

      if (mode === 'root' || mode === 'eager-root') {
        return createComponent(server.MenuRoot, {
          lazyMount: mode === 'eager-root' ? false : undefined,
          /** Place content under the machine-owning root. */
          get children() {
            return menuParts();
          },
        });
      }

      return createComponent(server.MenuRootProvider, {
        value: server.useMenu({ defaultOpen: false }),
        lazyMount: mode === 'lazy-provider' ? true : undefined,
        /** Place content under the caller-owned machine. */
        get children() {
          return menuParts();
        },
      });
    },
  );
}

/** Check the lazy root and eager external-provider defaults. */
function verifiesServerPresenceDefaults(): void {
  for (const mode of ['root', 'lazy-provider'] as const) {
    const markup = renderServerMenu(mode);
    expect(markup).not.toContain('data-menu-positioner');
    expect(markup).not.toContain('id="server-menu-content"');
  }

  for (const mode of ['eager-root', 'provider'] as const) {
    const markup = renderServerMenu(mode);
    expect(markup).toContain('data-menu-positioner');
    expect(markup).toContain('id="server-menu-content"');
    expect(markup).toMatch(/id="server-menu-content"[^>]*\shidden(?:\s|>)/);
    expect(markup).toContain('data-state="closed"');
  }
}

test(
  'published Menu roots preserve default and explicit presence modes',
  verifiesServerPresenceDefaults,
);
