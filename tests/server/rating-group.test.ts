import { createComponent, type Component } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RatingGroup as RatingGroupExport } from '../../src';

type ServerComponents = {
  RatingGroup: typeof RatingGroupExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published default rating composition on the server. */
function renderServerRatingGroup(): string {
  return renderToString(
    /** Create the primitive rating machine without a styling provider. */
    () =>
      createComponent(server.RatingGroup.Root as Component<Record<string, unknown>>, {
        name: 'score',
        defaultValue: 2.5,
        allowHalf: true,
        /** Let Control generate the default items. */
        get children() {
          return [
            createComponent(server.RatingGroup.Label, { children: 'Quality' }),
            createComponent(server.RatingGroup.Control, {}),
            createComponent(server.RatingGroup.HiddenInput, {}),
          ];
        },
      }),
  );
}

/** Retain rating semantics, half state, and layered icons in server output. */
function verifiesServerRatingGroup(): void {
  const markup = renderServerRatingGroup();
  expect(markup).toContain('data-rating-group-');
  expect(markup).toContain('lui-rating-group__root');
  expect(markup).toContain('lui-rating-group__itemIndicator');
  expect(markup).toContain('role="radiogroup"');
  expect(markup).toMatch(/\sdata\-half(?:=""|(?=[\s/>]))/);
  expect(markup).toContain('type="text"');
  expect(markup).toMatch(/\sdata\-bg(?:=""|(?=[\s/>]))/);
  expect(markup).toMatch(/\sdata\-fg(?:=""|(?=[\s/>]))/);
  expect(markup).toContain('data-size="md"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|size|allowHalf)=/);
}

test('published Rating Group renders default items and a half rating', verifiesServerRatingGroup);
