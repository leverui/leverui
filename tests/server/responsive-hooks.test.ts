import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  useBreakpoint as BreakpointExport,
  useBreakpointValue as BreakpointValueExport,
  useMediaQuery as MediaQueryExport,
} from '../../src';

interface ServerHooks {
  useBreakpoint: typeof BreakpointExport;
  useBreakpointValue: typeof BreakpointValueExport;
  useMediaQuery: typeof MediaQueryExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerHooks;

/** Render all three public hooks without a styling provider. */
function renderResponsiveFallbacks(): string {
  return renderToString(
    /** Resolve responsive values without a provider or browser window. */
    () => {
      const media = server.useMediaQuery(['(min-width: 600px)', '(min-width: 900px)'], {
        fallback: [true, false],
      });
      const breakpoint = server.useBreakpoint({ fallback: 'md' });
      const value = server.useBreakpointValue(
        { base: 'compact', md: 'medium' },
        { fallback: 'md' },
      );
      return `${media().join(',')} / ${breakpoint()} / ${value()}`;
    },
  );
}

/** Keep server rendering independent of browser media-query APIs. */
function verifiesServerFallback(): void {
  expect(renderResponsiveFallbacks()).toContain('true,false / md / medium');
}

test('published responsive hooks render server fallbacks', verifiesServerFallback);
