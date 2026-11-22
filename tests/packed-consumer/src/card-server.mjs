import assert from 'node:assert/strict';
import {
  CardRoot,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Card through the installed package's server entry. */
function renderInstalledCard() {
  return renderToString(
    /** Render Card through its published CSS contract. */
    () =>
      createComponent(CardRoot, {
        id: 'packed-server-card',
        variant: 'outline',
        size: 'sm',
        /** Construct parts within the Card's slot context. */
        get children() {
          return [
            createComponent(CardHeader, {
              /** Build heading parts inside the header. */
              get children() {
                return [
                  createComponent(CardTitle, { children: 'Installed title' }),
                  createComponent(CardDescription, { children: 'Installed description' }),
                ];
              },
            }),
            createComponent(CardBody, { children: 'Installed body' }),
            createComponent(CardFooter, { children: 'Installed footer' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledCard();
assert.match(markup, /<div[^>]*id="packed-server-card"/);
assert.match(markup, /leverui-card/);
assert.match(markup, /<h3[^>]*>Installed title<\/h3>/);
assert.match(markup, /<p[^>]*>Installed description<\/p>/);
assert.match(markup, /Installed body/);
assert.match(markup, /Installed footer/);
assert.doesNotMatch(markup, /\svariant="outline"/);
assert.doesNotMatch(markup, /\ssize="sm"/);
console.log('Packed Card server rendering passed.');
