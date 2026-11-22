import foundationCss from '../../src/styles/tokens-foundation.css?raw';
import sizesCss from '../../src/styles/tokens-sizes.css?raw';
import colorsCss from '../../src/styles/tokens-colors.css?raw';
import lightCss from '../../src/styles/mode-light.css?raw';
import darkCss from '../../src/styles/mode-dark.css?raw';
import motionOneCss from '../../src/styles/motion-01.css?raw';
import motionTwoCss from '../../src/styles/motion-02.css?raw';
import motionThreeCss from '../../src/styles/motion-03.css?raw';
import motionFourCss from '../../src/styles/motion-04.css?raw';
import motionFiveCss from '../../src/styles/motion-05.css?raw';

export interface TokenDocEntry {
  name: string;
  value: string;
  originalValue: string;
  extensions: {
    prop: string;
    category: string;
    negative: false;
    pixelValue?: string | undefined;
    cssVar: { ref: string };
    conditions?: Record<string, string> | undefined;
  };
}

const categoryPrefixes = {
  aspectRatios: 'aspect-ratios',
  colors: 'colors',
  durations: 'durations',
  easings: 'easings',
  fonts: 'fonts',
  fontSizes: 'font-sizes',
  fontWeights: 'font-weights',
  letterSpacings: 'letter-spacings',
  lineHeights: 'line-heights',
  radii: 'radii',
  sizes: 'sizes',
  spacing: 'spacing',
  zIndex: 'z-index',
  breakpoints: 'breakpoints',
} as const;

export type TokenDocCategory = keyof typeof categoryPrefixes;

/** Read published custom property declarations from authored CSS. */
function declarations(css: string): Map<string, string> {
  const values = new Map<string, string>();
  for (const match of css.matchAll(/--leverui-([\w./\\-]+)\s*:\s*([^;]+);/g)) {
    const name = match[1]?.replaceAll('\\', '');
    const value = match[2]?.replace(/\s+/g, ' ').trim();
    if (name && value) values.set(name, value);
  }
  return values;
}

const baseValues = new Map([
  ...declarations(foundationCss),
  ...declarations(sizesCss),
  ...declarations(colorsCss),
]);
const lightValues = declarations(lightCss);
const darkValues = declarations(darkCss);

/** Convert one custom property to the familiar dotted token label. */
function tokenLabel(category: TokenDocCategory, suffix: string): string {
  if (category !== 'colors') return suffix;
  const parts = suffix.split('-');
  if (parts.length > 1 && (parts[0] === 'bg' || parts[0] === 'fg' || parts[0] === 'border')) {
    return parts.join('.');
  }
  if (
    parts.length > 1 &&
    /^(\d+|contrast|fg|subtle|muted|emphasized|solid|focus|ring|border)$/.test(parts.at(-1) ?? '')
  ) {
    return `${parts[0]}.${parts.slice(1).join('-')}`;
  }
  return suffix;
}

/** Produce the token specimens from the same CSS that ships with the package. */
export function tokenDocEntries(category: TokenDocCategory): TokenDocEntry[] {
  const prefix = `${categoryPrefixes[category]}-`;
  const names = new Set([...baseValues.keys(), ...lightValues.keys()]);
  return [...names]
    .filter(
      /** Keep properties from the requested token family. */
      (name) => name.startsWith(prefix),
    )
    .map(
      /** Convert one authored declaration to a gallery specimen. */
      (name) => {
        const suffix = name.slice(prefix.length);
        const value = baseValues.get(name) ?? lightValues.get(name) ?? '';
        const conditions = lightValues.has(name)
          ? { _light: value, _dark: darkValues.get(name) ?? value }
          : undefined;
        const pixelValue = /^(\d+(?:\.\d+)?)rem$/.test(value)
          ? `${Number.parseFloat(value) * 16}px`
          : /^\d+(?:\.\d+)?px$/.test(value)
            ? value
            : undefined;
        return {
          name: `${category}.${tokenLabel(category, suffix)}`,
          value,
          originalValue: value,
          extensions: {
            prop: suffix,
            category,
            negative: false as const,
            pixelValue,
            cssVar: { ref: `var(--leverui-${name})` },
            conditions,
          },
        };
      },
    );
}

/** Find a single authored CSS token for a specimen label. */
export function tokenDocEntry(name: string): TokenDocEntry | undefined {
  const category = name.split('.')[0] as TokenDocCategory;
  if (!(category in categoryPrefixes)) return undefined;
  return tokenDocEntries(category).find(
    /** Find the dotted public token label. */
    (token) => token.name === name,
  );
}

/** List the public keyframes authored in the package stylesheet. */
export function tokenDocKeyframes(): string[] {
  const css = [motionOneCss, motionTwoCss, motionThreeCss, motionFourCss, motionFiveCss].join('\n');
  return [
    ...new Set(
      [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(
        /** Keep each keyframe's authored name once. */
        (match) => match[1] ?? '',
      ),
    ),
  ];
}
