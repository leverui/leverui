import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { DownloadTrigger as TriggerExport } from '../../src';

type ServerComponents = {
  DownloadTrigger: typeof TriggerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a public download button without touching browser file APIs. */
function renderDownloadButton(): string {
  return renderToString(
    /** Render the published native trigger without a styling provider. */
    () =>
      createComponent(server.DownloadTrigger, {
        data: 'server payload',
        fileName: 'server.txt',
        mimeType: 'text/plain',
        'aria-label': 'Save server file',
        children: 'Save',
      }),
  );
}

/** Keep SSR markup semantic while excluding download-only data attributes. */
function verifiesServerDownload(): void {
  const markup = renderDownloadButton();
  expect(markup).toContain('<button');
  expect(markup).toContain('type="button"');
  expect(markup).toContain('aria-label="Save server file"');
  expect(markup).toContain('leverui-download-trigger');
  expect(markup).toContain('Save</button>');
  expect(markup).not.toContain('server payload');
  expect(markup).not.toContain('server.txt');
  expect(markup).not.toContain('mimeType=');
}

test('published DownloadTrigger renders a server-safe button', verifiesServerDownload);

/** Keep a selected native anchor and its consumer attributes in server markup. */
function verifiesSelectedAnchor(): void {
  const markup = renderToString(
    /** Render the public selected-tag path without a provider. */
    () =>
      createComponent(server.DownloadTrigger<'a'>, {
        as: 'a',
        href: '#download',
        class: 'consumer-download',
        data: 'selected payload',
        fileName: 'selected.txt',
        mimeType: 'text/plain',
        children: 'Save selected file',
      }),
  );
  expect(markup).toMatch(/<a[^>]*href="#download"/);
  expect(markup).toContain('leverui-download-trigger consumer-download');
  expect(markup).toContain('Save selected file</a>');
  expect(markup).not.toContain('type="button"');
  expect(markup).not.toContain('selected payload');
}

test('published DownloadTrigger preserves a selected anchor', verifiesSelectedAnchor);
