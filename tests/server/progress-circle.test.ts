import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { ProgressCircle as CircleExport } from '../../src';

type ServerComponents = { ProgressCircle: typeof CircleExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render Circle through the published server entry without a style provider. */
function renderServerCircle(): string {
  return renderToString(
    /** Create the Circle root before its native SVG parts. */
    () =>
      createComponent(server.ProgressCircle.Root, {
        value: 30,
        max: 60,
        size: 'lg' as const,
        /** Render parts beneath the primitive's machine context. */
        get children() {
          return [
            createComponent(server.ProgressCircle.Label, {
              id: 'server-circle-label',
              children: 'Preparing files',
            }),
            createComponent(server.ProgressCircle.Circle, {
              'aria-labelledby': 'server-circle-label',
              /** Put both SVG circles inside the accessible progressbar. */
              get children() {
                return [
                  createComponent(server.ProgressCircle.Track, {}),
                  createComponent(server.ProgressCircle.Range, {}),
                ];
              },
            }),
            createComponent(server.ProgressCircle.ValueText, {}),
          ];
        },
      }),
  );
}

/** Verify provider-free SVG semantics and hooks without presentation styles. */
function verifiesServerCircle(): void {
  const markup = renderServerCircle();
  expect(markup).toContain('data-progress-');
  expect(markup).toContain('data-size="lg"');
  expect(markup).toContain('leverui-progress-circle__root');
  expect(markup).toContain('leverui-progress-circle__circleRange');
  expect(markup).toContain('role="progressbar"');
  expect(markup).toContain('aria-labelledby="server-circle-label"');
  expect(markup).toContain('aria-valuenow="30"');
  expect(markup).toContain('aria-valuemax="60"');
  expect(markup).toContain('Preparing files');
  expect(markup).toContain('50%');
  expect(markup).not.toMatch(/\s(?:size|recipe|unstyled)=/);
}

test('published Progress Circle renders provider-free SVG CSS hooks', verifiesServerCircle);
