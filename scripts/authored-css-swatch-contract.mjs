const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inherit', 'full'];
const shapes = ['square', 'circle', 'rounded'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Require every public Color Swatch part and finite appearance selector. */
export const colorSwatchContentContract = {
  family: 'color-swatch',
  required: [
    '.leverui-color-swatch:not([data-unstyled])',
    '.leverui-color-swatch[data-mix]',
    '.leverui-color-swatch__mix-grid',
    '.leverui-color-swatch[data-mix-cell]',
    '.leverui-color-swatch[data-mix-last]',
    ...sizes.map(
      /** Require each scalar size choice. */
      (size) => `[data-size='${size}']`,
    ),
    ...shapes.map(
      /** Require each scalar shape choice. */
      (shape) => `[data-shape='${shape}']`,
    ),
    ...breakpoints.flatMap(
      /** Require every size selector at an ordinary breakpoint. */
      (breakpoint) =>
        sizes.map(
          /** Match each finite size to its data attribute. */
          (size) => `[data-size-${breakpoint}='${size}']`,
        ),
    ),
    ...breakpoints.flatMap(
      /** Require every shape selector at an ordinary breakpoint. */
      (breakpoint) =>
        shapes.map(
          /** Match each finite shape to its data attribute. */
          (shape) => `[data-shape-${breakpoint}='${shape}']`,
        ),
    ),
    '--leverui-swatch-color',
    '--leverui-swatch-size',
    '--leverui-swatch-radius',
    '--leverui-swatch-checker-size',
    '--leverui-swatch-checker-bg',
    '--leverui-swatch-checker-fg',
  ],
};
