import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Heading as HeadingExport,
  HeadingProps,
  HeadingPropsProvider as PropsProviderExport,
} from '../src';

export interface HeadingHydrationComponents {
  Heading: typeof HeadingExport;
  HeadingPropsProvider: typeof PropsProviderExport;
}

/** Build the same responsive, provider-scoped heading on server and browser. */
export function renderHeadingHydrationTree({
  Heading,
  HeadingPropsProvider,
}: HeadingHydrationComponents): JSX.Element {
  const [blue, setBlue] = createSignal(false);

  /** Change inherited native color without replacing the server heading. */
  function toggleColor(): void {
    setBlue(!blue());
  }

  return createComponent(HeadingPropsProvider, {
    /** Supply live provider defaults after hydration. */
    get value() {
      return {
        style: { color: `var(--lui-colors-${blue() ? 'blue' : 'red'}-500)` },
      };
    },
    /** Render the semantic heading and its update control. */
    get children() {
      return [
        createComponent(Heading, {
          id: 'hydrated-heading',
          size: { base: 'sm', md: 'lg' },
          children: 'Hydrated heading',
        } satisfies HeadingProps<'h2'>),
        createComponent(Dynamic, {
          component: 'button',
          id: 'heading-hydration-toggle',
          type: 'button',
          onClick: toggleColor,
          children: 'Toggle heading color',
        }),
      ];
    },
  });
}
