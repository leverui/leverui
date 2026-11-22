import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  PopoverContent as ContentExport,
  PopoverPositioner as PositionerExport,
  PopoverRoot as RootExport,
  PopoverRootProvider as RootProviderExport,
  usePopover as UsePopoverExport,
} from '../../src';

type ServerComponents = {
  PopoverContent: typeof ContentExport;
  PopoverPositioner: typeof PositionerExport;
  PopoverRoot: typeof RootExport;
  PopoverRootProvider: typeof RootProviderExport;
  usePopover: typeof UsePopoverExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render one closed Popover mode through the published server entry. */
function renderServerPopover(mode: 'root' | 'lazy-root' | 'provider' | 'lazy-provider'): string {
  return renderToString(
    /** Create the primitive state beneath the active Lever UI context. */
    () => {
      /** Render the positioned surface for server presence checks. */
      function popoverParts(): JSX.Element {
        return createComponent(server.PopoverPositioner, {
          /** Keep content beneath the primitive's presence context. */
          get children() {
            return createComponent(server.PopoverContent, {
              id: 'server-popover-content',
              children: 'Popover body',
            });
          },
        });
      }

      if (mode === 'root' || mode === 'lazy-root') {
        return createComponent(server.PopoverRoot, {
          lazyMount: mode === 'lazy-root',
          /** Place content under the machine-owning root. */
          get children() {
            return popoverParts();
          },
        });
      }

      return createComponent(server.PopoverRootProvider, {
        value: server.usePopover({ defaultOpen: false }),
        lazyMount: mode === 'lazy-provider',
        /** Place content under the caller-owned machine. */
        get children() {
          return popoverParts();
        },
      });
    },
  );
}

/** Preserve the primitive's eager default and explicit lazy presence on the server. */
function verifiesPopoverServerPresence(): void {
  for (const mode of ['root', 'provider'] as const) {
    const markup = renderServerPopover(mode);
    expect(markup).toContain('data-popover-positioner');
    expect(markup).toContain('id="server-popover-content"');
    expect(markup).toMatch(/id="server-popover-content"[^>]*\shidden(?:\s|>)/);
    expect(markup).toContain('data-state="closed"');
  }

  for (const mode of ['lazy-root', 'lazy-provider'] as const) {
    const markup = renderServerPopover(mode);
    expect(markup).not.toContain('data-popover-positioner');
    expect(markup).not.toContain('id="server-popover-content"');
  }
}

test(
  'published Popover roots preserve eager and explicit lazy presence',
  verifiesPopoverServerPresence,
);
