import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { VisuallyHidden as VisuallyHiddenExport, VisuallyHiddenProps } from '../src';

export interface VisuallyHiddenHydrationComponents {
  VisuallyHidden: typeof VisuallyHiddenExport;
}

type GetChildProps = Parameters<NonNullable<VisuallyHiddenProps['asChild']>>[0];

/** Share CSS-clipped content between server rendering and client hydration. */
export function renderVisuallyHiddenHydrationTree(
  components: VisuallyHiddenHydrationComponents,
): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Update content and a consumer class while keeping its native node. */
  function toggle(): void {
    setWide(!wide());
  }

  /** Render an input that keeps the parent's hidden styles during hydration. */
  function renderInput(getProps: GetChildProps): JSX.Element {
    return createComponent(Dynamic, {
      component: 'input',
      ...getProps({ 'aria-label': 'Hydrated hidden input' }),
      id: 'hydrated-hidden-input',
      type: 'text',
    });
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Match the server's child order before updating the signal. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hidden-toggle',
          onClick: toggle,
          children: 'Update hidden content',
        }),
        createComponent(components.VisuallyHidden, {
          id: 'hydrated-hidden-text',
          /** Follow consumer CSS without replacing the native span. */
          get class() {
            return wide() ? 'hydrated-hidden-wide' : undefined;
          },
          /** Preserve accessible text while its value changes. */
          get children() {
            return wide() ? 'Updated hidden text' : 'Initial hidden text';
          },
        }),
        createComponent(components.VisuallyHidden, {
          asChild: renderInput,
        }),
      ];
    },
  });
}
