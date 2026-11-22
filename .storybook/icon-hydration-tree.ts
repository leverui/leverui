import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Icon as IconExport,
  IconPropsProvider as PropsProviderExport,
  createIcon as CreateIconExport,
} from '../src';

export interface IconHydrationComponents {
  Icon: typeof IconExport;
  IconPropsProvider: typeof PropsProviderExport;
  createIcon: typeof CreateIconExport;
}

/** Render one plain Icon to isolate native SVG hydration. */
export function renderSimpleIconHydrationTree({ Icon }: IconHydrationComponents): JSX.Element {
  return createComponent(Icon, { id: 'hydrated-simple-icon', size: 'sm' as const });
}

/** Render a provider-owned SVG child to isolate nested hydration. */
export function renderProviderIconHydrationTree({
  Icon,
  IconPropsProvider,
}: IconHydrationComponents): JSX.Element {
  return createComponent(IconPropsProvider, {
    value: { size: 'sm' },
    /** Render one native SVG under inherited defaults. */
    get children() {
      const path = createComponent(Dynamic, {
        component: 'path',
        id: 'hydrated-provider-path',
        d: 'M3 3h18v18H3z',
      });
      return createComponent(Icon, {
        id: 'hydrated-provider-icon',
        children: path,
      });
    },
  });
}

/** Build matching native and created SVGs on the server and in the browser. */
export function renderIconHydrationTree({
  Icon,
  IconPropsProvider,
  createIcon,
}: IconHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change provider defaults while keeping every SVG mounted. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Build fresh custom geometry for each created Icon instance. */
  function renderCircle(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'circle',
      id: 'hydrated-created-circle',
      cx: '12',
      cy: '12',
      r: '8',
    });
  }

  const PathIcon = createIcon({ d: 'M4 4h16v16H4z' });
  const CircleIcon = createIcon({ path: renderCircle });

  return [
    createComponent(IconPropsProvider, {
      /** Recompute shared size and title after hydration. */
      get value() {
        return {
          size: large() ? ('lg' as const) : ('xs' as const),
          title: large() ? 'Large icon' : 'Small icon',
        };
      },
      /** Render native and created SVGs through the shared defaults. */
      get children() {
        const path = createComponent(Dynamic, {
          component: 'path',
          id: 'hydrated-icon-path',
          d: 'M3 3h18v18H3z',
        });
        return [
          createComponent(Icon, {
            id: 'hydrated-icon',
            viewBox: '0 0 24 24',
            children: path,
          }),
          createComponent(PathIcon, { id: 'hydrated-created-icon' }),
          createComponent(CircleIcon, { id: 'hydrated-created-custom-icon' }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'icon-hydration-toggle',
      type: 'button',
      onClick: toggleSize,
      children: 'Toggle Icon size',
    }),
  ];
}
