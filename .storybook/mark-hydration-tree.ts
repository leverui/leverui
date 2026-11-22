import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Mark as MarkExport,
  MarkProps,
  MarkPropsProvider as PropsProviderExport,
} from '../src';

export interface MarkHydrationComponents {
  Mark: typeof MarkExport;
  MarkPropsProvider: typeof PropsProviderExport;
}

/** Build identical responsive and provider-scoped Marks for SSR and hydration. */
export function renderMarkHydrationTree({
  Mark,
  MarkPropsProvider,
}: MarkHydrationComponents): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Change the inherited variant without replacing either native mark. */
  function toggleVariant(): void {
    setChanged(!changed());
  }

  return createComponent(MarkPropsProvider, {
    /** Supply the latest inherited variant to both Marks. */
    get value() {
      return {
        variant: changed() ? ('text' as const) : ('solid' as const),
        colorPalette: 'blue',
      };
    },
    /** Render semantic marks before their variant update control. */
    get children() {
      return [
        createComponent(Mark, {
          id: 'hydrated-mark',
          children: 'Hydrated emphasis',
        } satisfies MarkProps<'mark'>),
        createComponent(Mark, {
          id: 'hydrated-responsive-mark',
          variant: { base: 'subtle', md: 'solid' },
          children: 'Responsive emphasis',
        } satisfies MarkProps<'mark'>),
        createComponent(Dynamic, {
          component: 'button',
          id: 'mark-hydration-toggle',
          type: 'button',
          onClick: toggleVariant,
          children: 'Toggle Mark variant',
        }),
      ];
    },
  });
}
