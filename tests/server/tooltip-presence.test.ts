import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  TooltipContent as ContentExport,
  TooltipPositioner as PositionerExport,
  TooltipRoot as RootExport,
  TooltipRootProvider as RootProviderExport,
  useTooltip as UseTooltipExport,
} from '../../src';

type ServerComponents = {
  TooltipContent: typeof ContentExport;
  TooltipPositioner: typeof PositionerExport;
  TooltipRoot: typeof RootExport;
  TooltipRootProvider: typeof RootProviderExport;
  useTooltip: typeof UseTooltipExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a closed Tooltip through either published server root. */
function renderServerTooltip(mode: 'root' | 'eager-root' | 'provider' | 'lazy-provider'): string {
  return renderToString(
    /** Create the primitive state beneath the active Lever UI context. */
    () => {
      /** Render the positioned surface within the primitive's presence context. */
      function tooltipParts(): JSX.Element {
        return createComponent(server.TooltipPositioner, {
          /** Preserve the content child beneath the positioner. */
          get children() {
            return createComponent(server.TooltipContent, {
              id: 'server-tooltip-content',
              children: 'Tooltip details',
            });
          },
        });
      }

      if (mode === 'root' || mode === 'eager-root') {
        const presence = mode === 'eager-root' ? { lazyMount: false, unmountOnExit: false } : {};
        return createComponent(server.TooltipRoot, {
          ...presence,
          /** Place content under the machine-owning root. */
          get children() {
            return tooltipParts();
          },
        });
      }

      return createComponent(server.TooltipRootProvider, {
        value: server.useTooltip({ defaultOpen: false }),
        lazyMount: mode === 'lazy-provider',
        /** Place content under the caller-owned machine. */
        get children() {
          return tooltipParts();
        },
      });
    },
  );
}

/** Preserve the default lazy root and the primitive's configurable provider presence. */
function verifiesTooltipServerPresence(): void {
  for (const mode of ['root', 'lazy-provider'] as const) {
    const markup = renderServerTooltip(mode);
    expect(markup).not.toContain('id="server-tooltip-content"');
    expect(markup).not.toContain('data-tooltip-positioner');
  }

  for (const mode of ['eager-root', 'provider'] as const) {
    const markup = renderServerTooltip(mode);
    expect(markup).toContain('id="server-tooltip-content"');
    expect(markup).toContain('data-tooltip-positioner');
    expect(markup).toContain('data-state="closed"');
  }
}

test(
  'published Tooltip roots preserve default and explicit presence',
  verifiesTooltipServerPresence,
);
