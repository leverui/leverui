/** A token name such as `blue.500` or `fg.muted`, or any CSS color. */
export type ChartColor = string;
/** A size token such as `4` or `sm`, or any CSS length. */
export type ChartSize = string;
/** A spacing token such as `4` or `1.5`, or any CSS length. */
export type ChartSpacing = string;

const singleWordColors = new Set(['bg', 'fg', 'border', 'white', 'black']);
const sizeNames = /^(?:[2-9]?x?s|sm|md|lg|x?l|[2-8]xl|full|min|max|fit|prose)$/;
const scaleStep = /^\d+(?:\.\d+)?$/;

/** Turn `colorPalette.focusRing` into the `color-palette-focus-ring` variable segment. */
function variableSegment(path: string): string {
  return path
    .split('.')
    .map(
      /** Convert one camelCase path part to kebab case. */
      (part) =>
        part.replace(
          /[A-Z]/g,
          /** Lower one capital letter after a dash. */
          (letter) => `-${letter.toLowerCase()}`,
        ),
    )
    .join('-');
}

/** Escape the dot in a fractional scale step, as the stylesheet names `spacing-1\.5`. */
function scaleSegment(step: string): string {
  return step.replace('.', '\\.');
}

/** Read a color token as its CSS variable, or return a raw CSS color unchanged. */
export function chartColorToken(key: ChartColor | undefined): string | undefined {
  if (key === undefined) return undefined;
  const isToken = /^[a-z][a-zA-Z]*(?:\.[a-zA-Z0-9]+)+$/.test(key) || singleWordColors.has(key);
  return isToken ? `var(--leverui-colors-${variableSegment(key)})` : key;
}

/** Read a size token as its CSS variable, or return a raw CSS length unchanged. */
export function chartSizeToken(key: ChartSize | undefined): string | undefined {
  if (key === undefined) return undefined;
  return scaleStep.test(key) || sizeNames.test(key)
    ? `var(--leverui-sizes-${scaleSegment(key)})`
    : key;
}

/** Read a spacing token as its CSS variable, or return a raw CSS length unchanged. */
export function chartSpacingToken(key: ChartSpacing | undefined): string | undefined {
  if (key === undefined) return undefined;
  return scaleStep.test(key) ? `var(--leverui-spacing-${scaleSegment(key)})` : key;
}
