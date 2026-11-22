import { splitProps } from '../primitives/utils/split-props';
import { createMemo, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ColorSwatch, ColorSwatchRoot } from './color-swatch';
import type { NativeElementTag } from './native-element-props';
import type { RenderChild } from '../styled-system/child-props';
import type { ColorSwatchBaseProps, ColorSwatchRuntimeProps } from './color-swatch-props';

interface ColorSwatchMixOptions extends Omit<ColorSwatchBaseProps, 'value'> {
  /** Preview up to four CSS colors in one clipped swatch. */
  items: readonly string[];
}

type NativeSwatchMixProps<As extends NativeElementTag> = Omit<
  JSX.IntrinsicElements[NoInfer<As>],
  keyof ColorSwatchMixOptions | 'value' | 'as' | 'asChild'
> &
  ColorSwatchMixOptions &
  (As extends 'span' ? { as?: As } : { as: As }) & { asChild?: never };
type ChildSwatchMixProps = Omit<
  JSX.IntrinsicElements['span'],
  keyof ColorSwatchMixOptions | 'value' | 'as' | 'asChild' | 'ref'
> &
  ColorSwatchMixOptions & {
    as?: never;
    asChild: RenderChild;
    ref?: ((element: HTMLElement) => void) | undefined;
  };

// Spelled out like ColorSwatchProps: distributing Omit over that union exceeds
// TypeScript's instantiation depth with Solid 2's element types.
export type ColorSwatchMixProps<As extends NativeElementTag = 'span'> =
  NativeSwatchMixProps<As> | ChildSwatchMixProps;

type MixRuntimeProps = Omit<ColorSwatchRuntimeProps, 'value'> & ColorSwatchMixOptions;

/** Display at most four colors inside one CSS grid swatch. */
function ColorSwatchMixRoot(props: MixRuntimeProps): JSX.Element {
  const [local, native] = splitProps(props, ['items', 'children']);
  const items = createMemo(
    /** Validate the live collection before rendering its cells. */
    () => {
      if (local.items.length > 4) {
        throw new Error('ColorSwatchMix supports at most four colors.');
      }
      return local.items;
    },
  );

  return (
    <ColorSwatchRoot {...native} value="transparent" data-mix="">
      <span class="leverui-color-swatch__mix-grid">
        <For each={items()}>
          {
            /** Render one color and mark the final cell in a three-color mix. */
            (item, index) => (
              <ColorSwatch
                value={item}
                size="inherit"
                shape="square"
                data-mix-cell=""
                data-mix-last={items().length === 3 && index() === 2 ? '' : undefined}
              />
            )
          }
        </For>
      </span>
    </ColorSwatchRoot>
  );
}

/** Expose native, selected-tag, and caller-owned mixed swatches. */
export const ColorSwatchMix = ColorSwatchMixRoot as {
  /** Infer the selected tag from `as` before checking native attributes. */
  <As extends NativeElementTag>(props: ColorSwatchMixProps<As> & { as: As }): JSX.Element;
  /** Render a span or caller-owned child when no native tag is selected. */
  (props: ColorSwatchMixProps): JSX.Element;
};
