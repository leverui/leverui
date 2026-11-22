import { createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from '@solidjs/web';
import { EnvironmentProvider, useEnvironmentContext } from '../../src';

/** Report whether the nearest environment resolved to a shadow root. */
function RootKind(): JSX.Element {
  const environment = useEnvironmentContext();
  return <span>{environment().getRootNode() instanceof ShadowRoot ? 'shadow' : 'document'}</span>;
}

/** Mirror the guide's Shadow DOM snippet with an observable child. */
export function EnvironmentWithShadow(): JSX.Element {
  // Solid 2's Portal mounts into an element, so the shadow root gets one.
  const [shadow, setShadow] = createSignal<{ root: ShadowRoot; mount: HTMLDivElement }>();

  /** Attach the shadow root and its portal container to the host element. */
  function attachRoot(host: HTMLDivElement): void {
    const root = host.attachShadow({ mode: 'open' });
    const mount = document.createElement('div');
    root.append(mount);
    setShadow({ root, mount });
  }

  return (
    <>
      <div ref={attachRoot} data-testid="environment-shadow-host" />
      <Show when={shadow()}>
        {
          /** Render the provider under the attached root. */
          (target) => (
            <Portal mount={target().mount}>
              <EnvironmentProvider value={target().root}>
                <RootKind />
              </EnvironmentProvider>
            </Portal>
          )
        }
      </Show>
    </>
  );
}
