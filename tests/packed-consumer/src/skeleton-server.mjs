import assert from 'node:assert/strict';
import { Skeleton, SkeletonCircle, SkeletonText } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Skeleton exports through the published server entry. */
function renderInstalledSkeletons() {
  /** Create repeatable content for each installed server text line. */
  function renderTextLine() {
    return 'Packed text';
  }

  return renderToString(
    /** Establish the public style system before rendering placeholders. */
    () => [
      createComponent(Skeleton, { id: 'packed-server-skeleton', loading: false }),
      createComponent(SkeletonCircle, { id: 'packed-server-circle', size: '10' }),
      createComponent(SkeletonText, {
        noOfLines: 2,
        rootProps: { id: 'packed-server-text' },
        children: renderTextLine,
      }),
    ],
  );
}

const markup = renderInstalledSkeletons();
assert.match(markup, /<div[^>]*id="packed-server-skeleton"/);
assert.match(markup, /<div[^>]*id="packed-server-circle"/);
assert.match(markup, /<div[^>]*id="packed-server-text"/);
assert.equal((markup.match(/Packed text/g) ?? []).length, 2);
assert.match(markup, /leverui-skeleton/);
assert.doesNotMatch(markup, /<div[^>]*\s(?:loading|variant|size|noOfLines)=/);
console.log('Packed Skeleton server rendering passed.');
