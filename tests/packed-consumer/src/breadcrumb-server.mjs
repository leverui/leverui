import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
} from '@leverui/components';

/** Render semantic Breadcrumb parts with packaged CSS. */
function renderBreadcrumb() {
  return createComponent(BreadcrumbRoot, {
    /** Place all locations inside the landmark's ordered list. */
    get children() {
      return createComponent(BreadcrumbList, {
        /** Render an ancestor and the current page from installed exports. */
        get children() {
          return [
            createComponent(BreadcrumbItem, {
              /** Keep the native anchor inside one list item. */
              get children() {
                return createComponent(BreadcrumbLink, { href: '/home', children: 'Home' });
              },
            }),
            createComponent(BreadcrumbItem, {
              /** Mark the current location without a destination. */
              get children() {
                return createComponent(BreadcrumbCurrentLink, { children: 'Settings' });
              },
            }),
          ];
        },
      });
    },
  });
}

const markup = renderToString(renderBreadcrumb);
assert.match(markup, /aria-label="breadcrumb"/);
assert.match(markup, /leverui-breadcrumb__list/);
assert.match(markup, /aria-current="page"/);
