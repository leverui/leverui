import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Toaster as ToasterExport, createToaster as CreateToasterExport } from '../../src';

type ServerComponents = {
  Toaster: typeof ToasterExport;
  createToaster: typeof CreateToasterExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the empty notification region from the published server entry. */
function renderServerToaster(): string {
  const toaster = server.createToaster({ placement: 'bottom-end' });
  return renderToString(
    /** Establish package styles before mounting the primitive's group. */
    () =>
      createComponent(server.Toaster, {
        toaster,
        label: 'Updates',
        /** No toast is present in the initial server render. */
        children: () => 'Unused server toast',
      }),
  );
}

/** Preserve the labeled live region without server-only toast content. */
function verifiesServerToaster(): void {
  const markup = renderServerToaster();
  // The primitive layer cannot render its region on the server; Lever renders a
  // static region with the same attributes and mounts the primitive's after hydration.
  expect(markup).toContain('data-toast-group');
  expect(markup).toContain('lui-toast__toaster');
  expect(markup).toContain('role="region"');
  expect(markup).toContain('aria-live="polite"');
  expect(markup).toContain('Updates');
  expect(markup).not.toContain('Unused server toast');
}

test('published Toaster renders its accessible region on the server', verifiesServerToaster);
