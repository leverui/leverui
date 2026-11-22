import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Heading as HeadingExport,
  HeadingPropsProviderProps,
  HeadingPropsProvider as PropsProviderExport,
} from '../src';

export interface HeadingCssHydrationComponents {
  Heading: typeof HeadingExport;
  HeadingPropsProvider: typeof PropsProviderExport;
}

/** Render a heading whose authored CSS size changes through provider defaults. */
export function renderHeadingCssHydrationTree({
  Heading,
  HeadingPropsProvider,
}: HeadingCssHydrationComponents): JSX.Element {
  const [step, setStep] = createSignal(0);

  /** Cycle responsive sizes and then remove the breakpoint override. */
  function toggleSize(): void {
    setStep(
      /** Wrap the three finite presentation states in a fixed order. */
      (current) => (current + 1) % 3,
    );
  }

  return createComponent(HeadingPropsProvider, {
    /** Supply a live finite variant without a style object. */
    get value(): HeadingPropsProviderProps['value'] {
      if (step() === 2) return { size: 'lg' };
      return { size: { base: 'lg', md: step() === 1 ? '4xl' : '2xl' } };
    },
    /** Place the heading and control under the same reactive owner. */
    get children() {
      return [
        createComponent(Heading, {
          id: 'hydrated-css-heading',
          children: 'Hydrated CSS heading',
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'heading-css-hydration-toggle',
          type: 'button',
          onClick: toggleSize,
          children: 'Toggle heading size',
        }),
      ];
    },
  });
}
