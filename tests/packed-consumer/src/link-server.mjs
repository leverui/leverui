import assert from 'node:assert/strict';
import { Link, LinkBox, LinkOverlay, LinkPropsProvider } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Create a separate inherited label for each published Link. */
function renderSharedLabel() {
  return createComponent(Dynamic, { component: 'span', children: 'Shared destination' });
}

/** Render the installed Link family with packaged CSS. */
function renderPackedLink() {
  return renderToString(
    /** Construct the same provider-free tree as a consumer. */
    () =>
      createComponent(LinkPropsProvider, {
        value: { variant: 'underline', children: renderSharedLabel },
        /** Render inherited, local, and card navigation. */
        get children() {
          return [
            createComponent(Link, { id: 'packed-server-link', href: '#shared' }),
            createComponent(Link, {
              id: 'packed-server-local',
              href: '#local',
              children: 'Local destination',
            }),
            createComponent(LinkBox, {
              as: 'article',
              id: 'packed-server-link-box',
              /** Keep the overlay inside its server-rendered box. */
              get children() {
                return createComponent(LinkOverlay, {
                  id: 'packed-server-overlay',
                  href: '#article',
                  children: 'Article',
                });
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderPackedLink();
assert.match(markup, /id="packed-server-link"/);
assert.match(markup, /<span[^>]*>Shared destination<\/span>/);
assert.match(markup, /id="packed-server-local"/);
assert.match(markup, /<article[^>]*id="packed-server-link-box"/);
assert.match(markup, /id="packed-server-overlay"/);
assert.match(markup, /href="#article"/);
assert.match(markup, /leverui-linkbox__overlay/);
assert.match(markup, /id="packed-server-link"[^>]*data-variant="underline"/);
assert.doesNotMatch(markup, /\s(?:variant|as)=/);
