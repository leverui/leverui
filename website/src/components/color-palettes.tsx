import { DarkMode, LightMode } from '@leverui/components';
import { createSignal, For, onCleanup } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { LinkedHeading } from './guide-headings';
import '../styles/color-palettes.css';

const palettes = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
] as const;
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const roles = [
  'solid',
  'subtle',
  'muted',
  'emphasized',
  'fg',
  'contrast',
  'border',
  'focus-ring',
] as const;
const alphaSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const neutrals = [
  {
    label: 'Background',
    name: 'bg',
    steps: ['', 'subtle', 'muted', 'emphasized', 'panel', 'inverted'],
  },
  { label: 'Text', name: 'fg', steps: ['', 'muted', 'subtle', 'inverted'] },
  { label: 'Border', name: 'border', steps: ['', 'subtle', 'muted', 'emphasized', 'inverted'] },
] as const;
const seeThrough = [
  { label: 'Black', name: 'black-alpha' },
  { label: 'White', name: 'white-alpha' },
] as const;

/** Name the CSS variable for one color. */
function colorVariable(name: string, step: string | number): string {
  return `--lui-colors-${name}${step === '' ? '' : `-${step}`}`;
}

/** Show every Lever UI color as a swatch that copies its variable when clicked. */
export function ColorPalettes(): JSX.Element {
  const [copied, setCopied] = createSignal('');
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(
    /** Cancel the pending reset when the page is left. */
    () => clearTimeout(resetTimer),
  );

  /** Copy a variable, ready to paste into CSS, and say so for a moment. */
  async function copy(variable: string): Promise<void> {
    const text = `var(${variable})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`Copied ${text}`);
    } catch {
      setCopied(`Could not copy ${text}`);
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(
      /** Go back to the hint once the confirmation has been read. */
      () => setCopied(''),
      2200,
    );
  }

  /** One swatch: a button filled with the color it copies. */
  function Swatch(props: { variable: string; label: string | number }): JSX.Element {
    return (
      <button
        type="button"
        class="color-swatch"
        title={props.variable}
        aria-label={`Copy ${props.variable}`}
        onClick={
          /** Copy this swatch's variable. */
          () => void copy(props.variable)
        }
      >
        <span style={{ '--swatch': `var(${props.variable})` }} />
        <small>{props.label === '' ? 'base' : props.label}</small>
      </button>
    );
  }

  /** The roles of every palette, and the neutral colors, as they look in one color mode. */
  function RolePanel(props: { title: string }): JSX.Element {
    return (
      <div class="color-mode-panel">
        <h3>{props.title}</h3>
        <For each={palettes}>
          {/** Show one palette's roles in a row. */}
          {(palette) => (
            <div class="color-row" style={{ '--color-columns': roles.length }}>
              <span class="color-row-name">{palette}</span>
              <For each={roles}>
                {/** Show one role of this palette. */}
                {(role) => <Swatch variable={colorVariable(palette, role)} label={role} />}
              </For>
            </div>
          )}
        </For>
        <For each={neutrals}>
          {/** Show one group of neutral colors in a row. */}
          {(group) => (
            <div class="color-row" style={{ '--color-columns': roles.length }}>
              <span class="color-row-name">{group.label}</span>
              <For each={group.steps}>
                {/** Show one neutral color. */}
                {(step) => <Swatch variable={colorVariable(group.name, step)} label={step} />}
              </For>
            </div>
          )}
        </For>
      </div>
    );
  }

  return (
    <div class="color-palettes">
      <p class="color-status" aria-live="polite">
        {copied() || 'Click a swatch to copy its variable.'}
      </p>
      <LinkedHeading level="h2" class="guide-section-heading" id="shades">
        Shades
      </LinkedHeading>
      <For each={palettes}>
        {/** Show one palette's shades in a row. */}
        {(palette) => (
          <div class="color-row" style={{ '--color-columns': shades.length }}>
            <span class="color-row-name">{palette}</span>
            <For each={shades}>
              {/** Show one shade of this palette. */}
              {(shade) => <Swatch variable={colorVariable(palette, shade)} label={shade} />}
            </For>
          </div>
        )}
      </For>
      <LinkedHeading level="h2" class="guide-section-heading" id="roles">
        Roles
      </LinkedHeading>
      <p class="color-note">
        The same variable names in each color mode. Use roles, not shades, for anything that should
        follow dark mode.
      </p>
      <LightMode>
        <RolePanel title="Light" />
      </LightMode>
      <DarkMode>
        <RolePanel title="Dark" />
      </DarkMode>
      <LinkedHeading level="h2" class="guide-section-heading" id="see-through">
        See-through black and white
      </LinkedHeading>
      <For each={seeThrough}>
        {/** Show one see-through scale over a checked background. */}
        {(scale) => (
          <div class="color-row color-row-alpha" style={{ '--color-columns': alphaSteps.length }}>
            <span class="color-row-name">{scale.label}</span>
            <For each={alphaSteps}>
              {/** Show one step of this scale. */}
              {(step) => <Swatch variable={colorVariable(scale.name, step)} label={step} />}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}
