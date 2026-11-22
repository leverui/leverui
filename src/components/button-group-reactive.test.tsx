import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Button, ButtonGroup } from '../index';

/** Keep an instance Button's size reactive under group recipe defaults. */
function verifiesInstanceSizeUpdate(): void {
  const [size, setSize] = createSignal<'sm' | 'lg'>('lg');

  /** Render a changing instance size inside a group provider. */
  function Example(): JSX.Element {
    return (
      <>
        <ButtonGroup size="md">
          <Button data-testid="reactive-group-button" size={size()}>
            Action
          </Button>
        </ButtonGroup>
      </>
    );
  }

  render(
    /** Mount the group in Solid's tracked JSX scope. */
    () => <Example />,
  );
  const button = screen.getByTestId('reactive-group-button');
  expect(button.getAttribute('data-size')).toBe('lg');
  setSize('sm');
  flush();
  expect(button.getAttribute('data-size')).toBe('sm');
}

it('updates a Button instance prop inside ButtonGroup', verifiesInstanceSizeUpdate);

/** Match an inherited group recipe selection to an explicit Button selection. */
function verifiesGroupRecipeDefaults(): void {
  render(
    /** Mount an inherited Button beside its explicit recipe equivalent. */
    () => (
      <>
        <ButtonGroup size="sm" variant="outline">
          <Button data-testid="inherited-button">Inherited</Button>
        </ButtonGroup>
        <Button size="sm" variant="outline" data-testid="explicit-button">
          Explicit
        </Button>
      </>
    ),
  );

  const inherited = screen.getByTestId('inherited-button');
  const explicit = screen.getByTestId('explicit-button');
  expect(inherited.getAttribute('data-size')).toBe(explicit.getAttribute('data-size'));
  expect(inherited.getAttribute('data-variant')).toBe(explicit.getAttribute('data-variant'));
}

it('passes ButtonGroup recipe defaults to its children', verifiesGroupRecipeDefaults);

/** Keep an inherited palette live without generating group presentation CSS. */
function verifiesGroupPaletteUpdate(): void {
  const [palette, setPalette] = createSignal<'blue' | 'teal'>('blue');

  /** Render a Button with its nearest group's palette selection. */
  function Example(): JSX.Element {
    return (
      <>
        <ButtonGroup colorPalette={palette()}>
          <Button data-testid="palette-group-button">Action</Button>
        </ButtonGroup>
      </>
    );
  }

  render(
    /** Mount the tracked group and descendant Button. */
    () => <Example />,
  );
  const button = screen.getByTestId('palette-group-button');
  expect(button.getAttribute('data-leverui-color-palette')).toBe('blue');
  setPalette('teal');
  flush();
  expect(button.getAttribute('data-leverui-color-palette')).toBe('teal');
}

it('updates inherited ButtonGroup palettes', verifiesGroupPaletteUpdate);
