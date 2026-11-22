import { createComponent, createSignal, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  EnvironmentProvider as EnvironmentProviderExport,
  Portal as PortalExport,
  useEnvironmentContext as useEnvironmentContextExport,
} from '../src';

type EnvironmentHydrationComponents = {
  EnvironmentProvider: typeof EnvironmentProviderExport;
  Portal: typeof PortalExport;
  useEnvironmentContext: typeof useEnvironmentContextExport;
};

/** Build one provider tree for published SSR and browser hydration. */
export function renderEnvironmentHydrationTree({
  EnvironmentProvider,
  Portal,
  useEnvironmentContext,
}: EnvironmentHydrationComponents): JSX.Element {
  /** Read the discovered root only after the provider has mounted. */
  function EnvironmentProbe(): JSX.Element {
    const environment = useEnvironmentContext();
    const [rootName, setRootName] = createSignal('server');

    /** Reveal the hydrated root without accessing document during SSR. */
    function revealRoot(): void {
      setRootName(environment().getRootNode().nodeName);
    }

    onSettled(revealRoot);
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'environment-hydrated-root',
      /** Reflect the root discovered after hydration. */
      get children() {
        return rootName();
      },
    });
  }

  /** Construct portal content under the owning environment. */
  function renderPortalContent(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'span',
      'data-testid': 'environment-hydrated-portal',
      children: 'Portalled after hydration',
    });
  }

  /** Keep server children lazy until the provider context exists. */
  function renderProviderChildren(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'div',
      'data-testid': 'environment-hydration-tree',
      /** Preserve stable siblings while the portal moves. */
      get children() {
        return [
          createComponent(Dynamic, {
            component: 'span',
            'data-testid': 'environment-hydration-stable',
            children: 'Stable sibling',
          }),
          createComponent(EnvironmentProbe, {}),
          createComponent(Portal, {
            /** Resolve content beneath the portal's environment context. */
            get children() {
              return renderPortalContent();
            },
          }),
        ];
      },
    });
  }

  return createComponent(EnvironmentProvider, {
    /** Resolve descendants beneath the primitive's shared environment context. */
    get children() {
      return renderProviderChildren();
    },
  });
}
