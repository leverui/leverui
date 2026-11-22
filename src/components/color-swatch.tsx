import { splitProps } from '../primitives/utils/split-props';
import { children, createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { colorSwatchAttributes } from './color-swatch-attributes';
import { readColorSwatchChoices } from './color-swatch-choices';
import type { NativeElementTag } from './native-element-props';
import {
  useColorSwatchProps,
  type ColorSwatchProps,
  type ColorSwatchRuntimeProps,
} from './color-swatch-props';
import { colorSwatchValueStyle } from './color-swatch-value-style';

/** Render a selected native element without inserting presentation CSS. */
const NativeElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render one color preview with finite CSS hooks and a native color value. */
export function ColorSwatchRoot(props: ColorSwatchRuntimeProps): JSX.Element {
  const [contentProps, instance] = splitProps(props, ['children']);
  const merged = useColorSwatchProps(instance);
  const [local, native] = splitProps(merged, [
    'as',
    'asChild',
    'value',
    'size',
    'shape',
    'unstyled',
    'class',
    'className',
    'ref',
  ]);
  const content = children(
    /** Preserve caller content through reactive appearance changes. */
    () => contentProps.children,
  );
  const choices = createMemo(
    /** Validate finite selections before publishing CSS attributes. */
    () => readColorSwatchChoices(local.size, local.shape),
  );

  /** Forward the selected native element to its consumer ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Keep native props, color, and CSS choice hooks reactive. */
    () => ({
      ...native,
      ...colorSwatchAttributes(choices().size, choices().shape),
      'data-value': local.value,
      'data-unstyled': local.unstyled ? '' : undefined,
      class: composeRecipeClassNames('color-swatch', undefined, local.class, local.className),
      style: colorSwatchValueStyle(local.value, native.style),
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild('ColorSwatch', local.asChild, attributes, content)
      ) : (
        <NativeElement component={local.as ?? 'span'} {...attributes()}>
          {content()}
        </NativeElement>
      )}
    </>
  );
}

/** Expose native, selected-tag, and caller-owned swatch paths. */
export const ColorSwatch = ColorSwatchRoot as <As extends NativeElementTag = 'span'>(
  props: ColorSwatchProps<As>,
) => JSX.Element;
export type { ColorSwatchProps } from './color-swatch-props';
