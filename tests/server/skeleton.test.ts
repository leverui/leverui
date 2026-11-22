import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Skeleton as SkeletonExport,
  SkeletonCircle as SkeletonCircleExport,
  SkeletonPropsProvider as SkeletonPropsProviderExport,
  SkeletonText as SkeletonTextExport,
} from '../../src';

type ServerComponents = {
  Skeleton: typeof SkeletonExport;
  SkeletonCircle: typeof SkeletonCircleExport;
  SkeletonPropsProvider: typeof SkeletonPropsProviderExport;
  SkeletonText: typeof SkeletonTextExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render all Skeleton exports through the published server entry. */
function renderServerSkeletons(): string {
  return renderToString(
    /** Render loading, circular, text, and revealed specimens. */
    () => [
      createComponent(server.Skeleton, { id: 'server-loading', children: 'Busy' }),
      createComponent(server.SkeletonCircle, { id: 'server-circle', size: '10' }),
      createComponent(server.SkeletonText, {
        noOfLines: 2,
        rootProps: { id: 'server-text' },
      }),
      createComponent(server.Skeleton, {
        id: 'server-loaded',
        loading: false,
        children: 'Ready',
      }),
    ],
  );
}

/** Verify package SSR, child content, and native state attributes. */
function verifiesServerSkeletons(): void {
  const markup = renderServerSkeletons();
  expect(markup).toMatch(/<div[^>]*id="server-loading"/);
  expect(markup).toMatch(/<div[^>]*id="server-circle"/);
  expect(markup).toMatch(/<div[^>]*id="server-text"/);
  expect(markup).toMatch(/<div[^>]*id="server-loaded"[^>]*>Ready<\/div>/);
  expect(markup).toContain('leverui-skeleton');
  expect(markup).not.toMatch(/<div[^>]*\s(?:loading|variant|noOfLines|size)=/);
}

test('published Skeleton exports render states and geometry', verifiesServerSkeletons);

/** Keep loading text children and line count in published server markup. */
function verifiesServerTextWithProvider(): void {
  /** Create repeatable text content for every server-rendered line. */
  function renderServerLine(): string {
    return 'Hidden server content';
  }

  const markup = renderToString(
    /** Render a provider default that must not replace Text's own loading default. */
    () =>
      createComponent(server.SkeletonPropsProvider, {
        value: { loading: false },
        /** Give both loading lines content that stays mounted. */
        get children() {
          return createComponent(server.SkeletonText, {
            noOfLines: 2,
            rootProps: { id: 'server-provider-text' },
            children: renderServerLine,
          });
        },
      }),
  );

  expect(markup).toContain('id="server-provider-text"');
  expect(markup.match(/class="[^"]*leverui-skeleton(?:\s|")/g)).toHaveLength(2);
  expect(markup.match(/Hidden server content/g)).toHaveLength(2);
}

test(
  'published SkeletonText keeps loading content under provider defaults',
  verifiesServerTextWithProvider,
);
