import { expect, it } from 'vitest';
import { readColorSwatchChoices } from './color-swatch-choices';
import { colorSwatchValueStyle } from './color-swatch-value-style';
import type { ColorSwatchProps } from './color-swatch-props';
import type { ColorSwatchMixProps } from './color-swatch-mix';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type Assignable<Value, Target> = Value extends Target ? true : false;

export type CssObjectRejected = ExpectFalse<'css' extends keyof ColorSwatchProps ? true : false>;
export type BoxSizeRejected = ExpectFalse<'boxSize' extends keyof ColorSwatchProps ? true : false>;
export type MixCssRejected = ExpectFalse<'css' extends keyof ColorSwatchMixProps ? true : false>;
export type MixValueRejected = ExpectFalse<
  'value' extends keyof ColorSwatchMixProps ? true : false
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ value: string; size: { base: 'xs'; md: 'lg' } }, ColorSwatchProps>
>;
export type SelectedButtonAccepted = ExpectTrue<
  Assignable<{ as: 'button'; value: string; type: 'button' }, ColorSwatchProps<'button'>>
>;

/** Reject unsupported finite choices and conditional selectors at runtime. */
function verifiesFiniteChoices(): void {
  const choices = readColorSwatchChoices({ base: 'xs', md: 'lg' }, ['square', null, 'circle']);
  expect(choices.size.md).toBe('lg');
  expect(choices.shape.md).toBe('circle');

  /** Read an unsupported size through the public parser boundary. */
  function invalidSize(): void {
    readColorSwatchChoices('giant', 'square');
  }

  /** Read an unsupported responsive condition through the parser boundary. */
  function invalidCondition(): void {
    readColorSwatchChoices({ hover: 'lg' }, 'square');
  }

  expect(invalidSize).toThrow('unsupported');
  expect(invalidCondition).toThrow('unsupported breakpoint');
}

it('accepts only authored Color Swatch size and shape choices', verifiesFiniteChoices);

/** Keep a color value from becoming extra declarations in native style strings. */
function verifiesSingleColorValue(): void {
  /** Submit a declaration-shaped value through the public color boundary. */
  function invalidColor(): void {
    colorSwatchValueStyle('red;outline:1px solid blue', 'width:20px');
  }

  expect(invalidColor).toThrow('one CSS color');
}

it('rejects declaration-shaped Color Swatch values', verifiesSingleColorValue);
