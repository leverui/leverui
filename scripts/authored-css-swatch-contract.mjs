const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inherit', 'full'];
const shapes = ['square', 'circle', 'rounded'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Require every public Color Swatch part and finite appearance selector. */
export const colorSwatchContentContract = {
  family: 'color-swatch',
  required: [
    '.lui-color-swatch:not([data-unstyled])',
    '.lui-color-swatch[data-mix]',
    '.lui-color-swatch__mix-grid',
    '.lui-color-swatch[data-mix-cell]',
    '.lui-color-swatch[data-mix-last]',
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
    '--lui-swatch-color',
    '--lui-swatch-size',
    '--lui-swatch-radius',
    '--lui-swatch-checker-size',
    '--lui-swatch-checker-bg',
    '--lui-swatch-checker-fg',
  ],
};
