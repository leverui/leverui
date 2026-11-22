import { ClientOnly } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Read a browser value only after the packaged component has mounted. */
function renderBrowserLocation(): JSX.Element {
  return <span id="packed-client-content">{window.location.pathname}</span>;
}

/** Exercise the installed ClientOnly export in an independent Solid app. */
export function PackedClientOnly(): JSX.Element {
  return (
    <ClientOnly fallback={<span id="packed-client-fallback">Loading</span>}>
      {renderBrowserLocation}
    </ClientOnly>
  );
}
