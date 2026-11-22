import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Code as CodeExport } from '../../src';

interface ServerComponents {
  Code: typeof CodeExport;
}

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Verify the published server entry renders native Code and recipe hooks. */
function verifiesServerCode(): void {
  const markup = renderToString(
    /** Build the code element inside the installed system context. */
    () =>
      createComponent(server.Code, {
        id: 'server-code',
        size: 'lg' as const,
        variant: 'solid' as const,
        colorPalette: 'blue' as const,
        children: 'npm run build',
      }),
  );

  expect(markup).toMatch(/<code[^>]*id="server-code"/);
  expect(markup).toContain('leverui-code');
  expect(markup).toContain('npm run build');
  expect(markup).not.toMatch(/\s(?:size|variant|colorPalette)=/);
}

test('published Code renders native markup and recipe styles', verifiesServerCode);
