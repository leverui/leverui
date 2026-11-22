import type { IconProps } from '@leverui/components';

type KeysOfUnion<T> = T extends unknown ? keyof T : never;
type ForbiddenIconKey = 'css' | 'recipe' | 'bg' | 'boxSize' | 'mb';
type AssertNever<T extends never> = T;
type AssertTrue<T extends true> = T;

/** Reject the unsupported object-style and recipe props in the installed package. */
export type IconHasNoObjectStyles = AssertNever<
  Extract<ForbiddenIconKey, KeysOfUnion<IconProps<'svg'>>>
>;

/** Retain finite responsive sizes in the installed Icon API. */
export type IconAcceptsResponsiveSize = AssertTrue<
  { base: 'xs'; md: 'lg' } extends NonNullable<IconProps<'svg'>['size']> ? true : false
>;
