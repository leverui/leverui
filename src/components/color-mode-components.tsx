import { splitProps } from '../primitives/utils/split-props';
import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { ClientOnly } from './client-only';
import { createColorMode, getColorModeScript, type ColorModeScriptOptions } from './color-mode';
import { IconButton, type IconButtonProps } from './icon-button';
import { Skeleton } from './skeleton';
import { Theme, type ThemeProps } from './theme';

/** Draw a sun for light mode. */
function SunGlyph(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

/** Draw a crescent moon for dark mode. */
function MoonGlyph(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}

/** Show a sun in light mode and a moon in dark mode. */
export function ColorModeIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>): JSX.Element {
  const { colorMode } = createColorMode();
  return (
    <Show when={colorMode() === 'dark'} fallback={<SunGlyph {...props} />}>
      <MoonGlyph {...props} />
    </Show>
  );
}

/** The plain button form of `IconButton`, which supplies its own label and icon. */
export type ColorModeButtonProps = Omit<
  Extract<IconButtonProps, { as?: never; asChild?: never }>,
  'aria-label' | 'children'
>;

/** Toggle the color mode with an icon that matches the active mode. */
export function ColorModeButton(props: ColorModeButtonProps): JSX.Element {
  const { toggleColorMode } = createColorMode();
  return (
    <ClientOnly fallback={<Skeleton class="lui-color-mode-button-placeholder" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        {...props}
      >
        <ColorModeIcon class="lui-color-mode-icon" />
      </IconButton>
    </ClientOnly>
  );
}

export interface ColorModeScriptProps extends ColorModeScriptOptions {
  /** The nonce your Content Security Policy expects on inline scripts. */
  readonly nonce?: string | undefined;
}

/**
 * Apply the saved or default color mode before the page paints. Render it in the document
 * `head`, before the stylesheets.
 */
export function ColorModeScript(props: ColorModeScriptProps): JSX.Element {
  return (
    <script nonce={props.nonce}>{getColorModeScript({ defaultMode: props.defaultMode })}</script>
  );
}

export type ForcedColorModeProps = Omit<ThemeProps, 'appearance'>;

/** Render a Theme scope that keeps its children in one mode without adding a box. */
function ForcedColorMode(
  props: ForcedColorModeProps & { appearance: 'light' | 'dark' },
): JSX.Element {
  const [local, rest] = splitProps(props, ['class']);
  return <Theme hasBackground={false} {...rest} class={['lui-color-mode-scope', local.class]} />;
}

/** Keep the children in light mode whatever the document uses. */
export function LightMode(props: ForcedColorModeProps): JSX.Element {
  return <ForcedColorMode {...props} appearance="light" />;
}

/** Keep the children in dark mode whatever the document uses. */
export function DarkMode(props: ForcedColorModeProps): JSX.Element {
  return <ForcedColorMode {...props} appearance="dark" />;
}
