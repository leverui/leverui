import { EnvironmentProvider, Portal, useEnvironmentContext } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Read the installed environment hook inside its provider. */
function PackedEnvironmentProbe(): JSX.Element {
  const environment = useEnvironmentContext();
  return <output id="packed-environment-root">{environment().getRootNode().nodeName}</output>;
}

/** Exercise the installed provider and portal in an independent app. */
export function PackedEnvironment(): JSX.Element {
  return (
    <EnvironmentProvider value={() => document}>
      <PackedEnvironmentProbe />
      <Portal>
        <span id="packed-environment-portal">Portalled environment</span>
      </Portal>
    </EnvironmentProvider>
  );
}
