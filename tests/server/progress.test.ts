import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Progress as ProgressExport } from '../../src';

type ServerComponents = { Progress: typeof ProgressExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Progress through the published server entry without a style provider. */
function renderServerProgress(): string {
  return renderToString(
    /** Create the primitive's Progress root before its native parts. */
    () =>
      createComponent(server.Progress.Root, {
        value: 30,
        max: 60,
        size: 'lg' as const,
        /** Render parts beneath the active machine. */
        get children() {
          return [
            createComponent(server.Progress.Label, {
              id: 'server-progress-label',
              children: 'Preparing files',
            }),
            createComponent(server.Progress.ValueText, {}),
            createComponent(server.Progress.Track, {
              'aria-labelledby': 'server-progress-label',
              /** Keep the range inside the accessible track. */
              get children() {
                return createComponent(server.Progress.Range, {});
              },
            }),
          ];
        },
      }),
  );
}

/** Verify server markup exposes state and hooks without inserted presentation CSS. */
function verifiesServerProgress(): void {
  const markup = renderServerProgress();
  expect(markup).toContain('data-progress-');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('lui-progress__root');
  expect(markup).toContain('lui-progress__range');
  expect(markup).toContain('role="progressbar"');
  expect(markup).toContain('aria-labelledby="server-progress-label"');
  expect(markup).toContain('aria-valuenow="30"');
  expect(markup).toContain('aria-valuemax="60"');
  expect(markup).toContain('width:50%');
  expect(markup).toContain('Preparing files');
  expect(markup).toContain('50%');
  expect(markup).not.toMatch(/\s(?:size|recipe|unstyled|striped|animated)=/);
}

test('published Progress renders provider-free semantic CSS hooks', verifiesServerProgress);
