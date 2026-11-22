import { Image, type ImageProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type NativeImageAccepted = ExpectTrue<
  Assignable<{ src: string; alt: string; htmlWidth: number; fit: 'contain' }, ImageProps<'img'>>
>;
export type WrongImageRefRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLButtonElement) => void }, ImageProps<'img'>>
>;
export type LinkImageAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: string; children: JSX.Element }, ImageProps<'a'>>
>;
export type ResponsiveFitAccepted = ExpectTrue<
  Assignable<{ fit: { base: 'cover'; md: 'contain' } }, ImageProps<'img'>>
>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { objectFit: 'cover' } }, ImageProps<'img'>>
>;
export type GeneralStylePropRejected = ExpectFalse<
  Assignable<{ boxSize: '12' }, ImageProps<'img'>>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, ImageProps<'img'>>
>;

/** Receive the native image through the installed declaration. */
function receiveImage(element: HTMLImageElement): void {
  element.dataset.imageRef = 'img';
}

export const nativeImage = (
  <Image src="data:," alt="Typed image" ref={receiveImage} fit="cover" align="left top" />
);
