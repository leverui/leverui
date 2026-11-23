import assert from 'node:assert/strict';
import { Avatar } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Avatar through the installed package's server entry. */
function renderInstalledAvatar() {
  return renderToString(
    /** Render Avatar with packaged CSS. */
    () =>
      createComponent(Avatar.Root, {
        id: 'packed-server-avatar',
        size: 'lg',
        variant: 'outline',
        /** Render content under the primitive's Avatar context. */
        get children() {
          return createComponent(Avatar.Fallback, { name: 'Grace Hopper' });
        },
      }),
  );
}

const markup = renderInstalledAvatar();
assert.match(markup, /data-avatar-root="packed-server-avatar"/);
assert.match(markup, /data-avatar-/);
assert.match(markup, /lui-avatar__root/);
assert.match(markup, /data-variant="outline"/);
assert.match(markup, />GH<\/span>/);
assert.doesNotMatch(markup, /\s(?:size|variant|name)=/);
console.log('Packed Avatar server rendering passed.');
