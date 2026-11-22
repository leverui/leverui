import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  BreadcrumbCurrentLink as CurrentLinkExport,
  BreadcrumbEllipsis as EllipsisExport,
  BreadcrumbItem as ItemExport,
  BreadcrumbLink as LinkExport,
  BreadcrumbList as ListExport,
  BreadcrumbRoot as RootExport,
  BreadcrumbSeparator as SeparatorExport,
} from '../../src';

type ServerComponents = {
  BreadcrumbCurrentLink: typeof CurrentLinkExport;
  BreadcrumbEllipsis: typeof EllipsisExport;
  BreadcrumbItem: typeof ItemExport;
  BreadcrumbLink: typeof LinkExport;
  BreadcrumbList: typeof ListExport;
  BreadcrumbRoot: typeof RootExport;
  BreadcrumbSeparator: typeof SeparatorExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Compose semantic Breadcrumb parts through the published server entry. */
function renderServerBreadcrumb(): string {
  return renderToString(
    /** Provide the normal theme and style collection context. */
    () =>
      createComponent(server.BreadcrumbRoot, {
        /** Place locations and separators in an ordered list. */
        get children(): JSX.Element {
          return createComponent(server.BreadcrumbList, {
            /** Render links, current page, and icons. */
            get children(): JSX.Element {
              return [
                createComponent(server.BreadcrumbItem, {
                  /** Keep the native anchor under its list item. */
                  get children() {
                    return createComponent(server.BreadcrumbLink, {
                      href: '/home',
                      children: 'Home',
                    });
                  },
                }),
                createComponent(server.BreadcrumbSeparator, {}),
                createComponent(server.BreadcrumbEllipsis, {}),
                createComponent(server.BreadcrumbItem, {
                  /** Mark the non-navigable current page. */
                  get children() {
                    return createComponent(server.BreadcrumbCurrentLink, {
                      children: 'Settings',
                    });
                  },
                }),
              ];
            },
          });
        },
      }),
  );
}

/** Verify server markup retains semantic defaults and styled part hooks. */
function verifiesServerMarkup(): void {
  const markup = renderServerBreadcrumb();
  expect(markup).toMatch(/<nav\b[^>]*aria-label="breadcrumb"/);
  expect(markup).toMatch(/<ol\b[^>]*leverui-breadcrumb__list/);
  expect(markup).toMatch(/<a\b[^>]*href="\/home"/);
  expect(markup).toMatch(/<span\b[^>]*role="link"[^>]*aria-current="page"/);
  expect(markup).toContain('role="presentation"');
  expect(markup).toContain('aria-hidden="true"');
  expect(markup).toContain('m9 18 6-6-6-6');
}

test('published Breadcrumb renders semantic server markup', verifiesServerMarkup);
