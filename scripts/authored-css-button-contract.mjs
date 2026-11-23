const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const variants = ['solid', 'subtle', 'surface', 'outline', 'ghost', 'plain'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Require each finite Button treatment and size at ordinary breakpoints. */
export const buttonContract = {
  family: 'button',
  required: [
    '.lui-button',
    ...sizes.map(
      /** Require each public base size. */
      (size) => `[data-size='${size}']`,
    ),
    ...variants.map(
      /** Require each public base treatment. */
      (variant) => `[data-variant='${variant}']`,
    ),
    ...breakpoints.flatMap(
      /** Require every size selector at this breakpoint. */
      (breakpoint) =>
        sizes.map(
          /** Keep each native size attribute backed by CSS. */
          (size) => `[data-size-${breakpoint}='${size}']`,
        ),
    ),
    ...breakpoints.flatMap(
      /** Require every treatment selector at this breakpoint. */
      (breakpoint) =>
        variants.map(
          /** Keep each native variant attribute backed by CSS. */
          (variant) => `[data-variant-${breakpoint}='${variant}']`,
        ),
    ),
  ],
};
