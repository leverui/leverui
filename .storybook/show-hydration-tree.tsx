import { createComponent, createSignal, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Show as ShowExport } from '../src';

export interface ShowHydrationOptions {
  initialValue: string | undefined;
}

/** Share one reactive Show tree between the published server and browser. */
export function renderShowHydrationTree(
  Show: typeof ShowExport,
  options: ShowHydrationOptions,
): JSX.Element {
  const [value, setValue] = createSignal<string | undefined>(options.initialValue);

  /** Enter the truthy branch from an initially absent value. */
  function reveal(): void {
    setValue('Alpha');
  }

  /** Change a truthy value without replacing its native output node. */
  function update(): void {
    setValue('Beta');
  }

  /** Return to the fallback branch. */
  function hide(): void {
    setValue(undefined);
  }

  /** Render the narrowed value through a tracked Solid accessor. */
  function renderValue(current: Accessor<string>): JSX.Element {
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'show-hydrated-value',
      /** Read the current truthy value after hydration updates. */
      get children() {
        return current();
      },
    });
  }

  return createComponent(Dynamic, {
    component: 'section',
    'data-testid': 'show-hydration-tree',
    /** Keep both control flow branches under one hydration owner. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'show-reveal',
          onClick: reveal,
          children: 'Reveal',
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'show-update',
          onClick: update,
          children: 'Update',
        }),
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'show-hide',
          onClick: hide,
          children: 'Hide',
        }),
        createComponent(Show, {
          /** Follow the signal without remounting the truthy branch. */
          get when() {
            return value();
          },
          /** Construct the fallback only when Solid reads the falsy branch. */
          get fallback() {
            return createComponent(Dynamic, {
              component: 'span',
              'data-testid': 'show-hydrated-fallback',
              children: 'Missing',
            });
          },
          children: renderValue,
        }),
      ];
    },
  });
}
