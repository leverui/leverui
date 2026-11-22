import { primitive, type HTMLPrimitiveProps } from '../primitives/components/factory';
import { type JSX } from '@solidjs/web';

/**
 * A primitive native element typed through the primitive's exported props.
 *
 * The primitive types `primitive.<tag>` with an unexported state prop, so a registry that
 * stores `primitive.div` cannot be named in Lever's declarations. Each element here
 * keeps the primitive's runtime component and its `state` input under a nameable type.
 */
export type PrimitiveNativePart<Tag extends keyof JSX.IntrinsicElements> = (
  props: HTMLPrimitiveProps<Tag> & { state?: unknown },
) => JSX.Element;

/** The primitive's native elements used beside machine parts in Lever's part registries. */
export const primitiveNativeParts: {
  readonly button: PrimitiveNativePart<'button'>;
  readonly div: PrimitiveNativePart<'div'>;
  readonly footer: PrimitiveNativePart<'footer'>;
  readonly header: PrimitiveNativePart<'header'>;
  readonly kbd: PrimitiveNativePart<'kbd'>;
  readonly span: PrimitiveNativePart<'span'>;
} = {
  button: primitive.button,
  div: primitive.div,
  footer: primitive.footer,
  header: primitive.header,
  kbd: primitive.kbd,
  span: primitive.span,
};
