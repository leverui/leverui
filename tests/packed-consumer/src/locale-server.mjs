import assert from 'node:assert/strict';
import { LocaleProvider, useFilter, useLocaleContext } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Read the nearest published locale and filter inside one server request. */
function LocaleProbe() {
  const context = useLocaleContext();
  const filter = useFilter({ sensitivity: 'base' });
  return `${context().locale}:${context().dir}:${filter().startsWith('I', 'ı')}`;
}

/** Render an isolated installed-package locale scope. */
function renderPackedLocale() {
  return createComponent(LocaleProvider, {
    locale: 'tr-TR',
    /** Evaluate the probe inside the installed provider. */
    get children() {
      return createComponent(LocaleProbe, {});
    },
  });
}

assert.equal(renderToString(renderPackedLocale), 'tr-TR:ltr:true');
assert.equal(renderToString(LocaleProbe), 'en-US:ltr:false');
console.log('Packed locale server rendering passed.');
