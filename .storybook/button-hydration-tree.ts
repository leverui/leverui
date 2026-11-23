import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Button as ButtonExport,
  ButtonGroup as ButtonGroupExport,
  ButtonGroupProps,
} from '../src';

type ButtonHydrationComponents = {
  Button: typeof ButtonExport;
  ButtonGroup: typeof ButtonGroupExport;
};

/** Build the same reactive Button group for server rendering and hydration. */
export function renderButtonHydrationTree(
  { Button, ButtonGroup }: ButtonHydrationComponents,
  stacking: ButtonGroupProps['stacking'] = 'first-on-top',
): JSX.Element {
  const [compact, setCompact] = createSignal(false);

  /** Change a CSS size and a group's participating children together. */
  function toggleGroup(): void {
    setCompact(!compact());
  }

  return [
    createComponent(ButtonGroup, {
      attached: true,
      stacking,
      id: 'hydrated-button-group',
      /** Create all three buttons inside the same group scope. */
      get children() {
        return [
          createComponent(Button, {
            id: 'hydrated-first',
            colorPalette: 'blue',
            /** Keep the first Button's size reactive after hydration. */
            get size() {
              return compact() ? ('sm' as const) : ('lg' as const);
            },
            /** Keep responsive treatments reactive on the same native action. */
            get variant() {
              return compact()
                ? ({ base: 'outline', md: 'ghost' } as const)
                : ({ base: 'surface', md: 'solid' } as const);
            },
            children: 'First',
          }),
          createComponent(Button, {
            id: 'hydrated-middle',
            /** Exclude the middle Button when compact mode starts. */
            get 'data-lui-group-skip'() {
              return compact() ? '' : undefined;
            },
            children: 'Middle',
          }),
          createComponent(Button, { id: 'hydrated-last', children: 'Last' }),
        ];
      },
    }),
    createComponent(Button, {
      id: 'hydrated-button-toggle',
      onClick: toggleGroup,
      /** Expose the signal independently of group styling. */
      get 'data-compact'() {
        return compact() ? 'true' : 'false';
      },
      children: 'Toggle group',
    }),
  ];
}
