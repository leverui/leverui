import { createComponent, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Box,
  Button,
  ButtonGroup,
  type ButtonGroupProps,
  Theme,
  Text,
  TextPropsProvider,
} from '../src';
import { renderCustomSystemsExample } from './custom-systems-example';
import { renderResponsiveExample } from '../demos/responsive-example';
import { renderScopedHydrationTree } from './scoped-hydration-tree';
import { renderTextHydrationTree } from './text-hydration-tree';
import { renderButtonHydrationTree } from './button-hydration-tree';
import './hydration-examples.css';
import '../demos/responsive-example.css';

/** Attach the browser copy of the fixture to its existing server markup. */
export function hydrateExample(target: HTMLElement): void {
  /** Create the same component tree used during server rendering. */
  const renderExample = () =>
    createComponent(Box, {
      'data-testid': 'hydrated-box',
      class: 'hydrated-box',
      children: 'Hydrated',
    });
  hydrate(renderExample, target);
}

/** Hydrate a fixture styled by an authored stylesheet. */
export function hydrateDefaultExample(target: HTMLElement): void {
  /** Mark the fixture only after Solid mounts the hydrated tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Match the server-rendered default stylesheet tree. */
  function renderDefaultExample() {
    const tree = createComponent(Box, {
      'data-testid': 'default-hydrated-box',
      class: 'default-hydrated-box',
      children: 'Default',
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderDefaultExample, target);
}

/** Hydrate the server-rendered Text tree without replacing its paragraph. */
export function hydrateTextExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to its existing Text markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the Text provider tree used by server rendering. */
  function renderExample(): JSX.Element {
    const tree = renderTextHydrationTree({ Text, TextPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}

/** Hydrate a server Button group and preserve its native action elements. */
export function hydrateButtonExample(
  target: HTMLElement,
  stacking: ButtonGroupProps['stacking'] = 'first-on-top',
): void {
  /** Mark the host once its Button group is attached. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server Button tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderButtonHydrationTree({ Button, ButtonGroup }, stacking);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}

/** Hydrate a nested mode scope without replacing its server-rendered DOM. */
export function hydrateScopedExample(target: HTMLElement): void {
  /** Mark the container after the theme tree hydrates. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's nested mode tree. */
  function renderScopedExample() {
    const tree = renderScopedHydrationTree({ Box, Theme });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderScopedExample, target);
}

/** Hydrate responsive styles and attach their signal-driven control. */
export function hydrateResponsiveExample(target: HTMLElement): void {
  /** Mark the container after Solid has attached to its server markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Render the same responsive tree used by the server. */
  function renderExample() {
    const tree = renderResponsiveExample({ Box, Button });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}

/** Hydrate two scoped custom systems and their default-theme control. */
export function hydrateCustomSystemsExample(target: HTMLElement): void {
  /** Signal that Solid has mounted the matching client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the same CSS scopes and component order used on the server. */
  function renderExample() {
    const tree = renderCustomSystemsExample({ Box, Button, Theme });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
