import { splitProps } from '../primitives/utils/split-props';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeSvgChild } from '../styled-system/native-svg-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import type { SvgChildProps } from '../styled-system/svg-child-props';
import { checkmarkAttributes } from './checkmark-attributes';
import { readCheckmarkChoices, readCheckmarkPalette } from './checkmark-choices';
import type { CheckmarkProps, CheckmarkRootProps } from './checkmark-props';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type CheckmarkState = 'unchecked' | 'checked' | 'indeterminate';
type CheckmarkAttributes = SvgChildProps & {
  'data-state': CheckmarkState;
  'data-disabled'?: string | undefined;
  'data-lui-color-palette'?: string | undefined;
  'data-unstyled'?: string | undefined;
};

/** Render a selected native element without component style tags. */
const NativeElement = Dynamic as (
  props: { component: IntrinsicElement } & JSX.SvgSVGAttributes<SVGSVGElement>,
) => JSX.Element;

/** Draw the current glyph on a native, caller-selectable SVG. */
function CheckmarkRoot(props: CheckmarkRootProps): JSX.Element {
  const [local, native] = splitProps(props, [
    'as',
    'asChild',
    'children',
    'checked',
    'indeterminate',
    'disabled',
    'size',
    'variant',
    'filled',
    'colorPalette',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const state = createMemo(
    /** Give the minus glyph priority when both selection flags are true. */
    (): CheckmarkState =>
      local.indeterminate ? 'indeterminate' : local.checked ? 'checked' : 'unchecked',
  );
  const choices = createMemo(
    /** Validate finite styling selections before binding SVG attributes. */
    () => readCheckmarkChoices(local.size, local.variant, local.filled),
  );

  /** Forward the chosen native element to the consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native overrides, state, and CSS selectors reactive. */
    (): CheckmarkAttributes => ({
      ...native,
      viewBox: native.viewBox ?? '0 0 24 24',
      fill: native.fill ?? 'none',
      stroke: native.stroke ?? 'currentColor',
      'stroke-width': native['stroke-width'] ?? '3px',
      'stroke-linecap': native['stroke-linecap'] ?? 'round',
      'stroke-linejoin': native['stroke-linejoin'] ?? 'round',
      ...checkmarkAttributes(choices()),
      'data-state': state(),
      'data-disabled': local.disabled ? '' : undefined,
      'data-lui-color-palette': readCheckmarkPalette(local.colorPalette),
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('checkmark', undefined, local.class, local.className),
      ref: attachNode,
    }),
  );
  const glyph = createMemo(
    /** Draw only the active glyph and ignore caller-provided children. */
    () =>
      state() === 'indeterminate' ? (
        <path d="M5 12h14" />
      ) : state() === 'checked' ? (
        <polyline points="20 6 9 17 4 12" />
      ) : null,
  );

  return (
    <>
      {local.asChild ? (
        renderNativeSvgChild('Checkmark', local.asChild, attributes, glyph)
      ) : (
        <NativeElement component={local.as ?? 'svg'} {...attributes()}>
          {glyph()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native Checkmark props with the selected element's ref type. */
export const Checkmark = CheckmarkRoot as <As extends IntrinsicElement = 'svg'>(
  props: CheckmarkProps<As>,
) => JSX.Element;
