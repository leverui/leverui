import {
  Badge,
  Button,
  DarkMode,
  Kbd,
  LightMode,
  Progress,
  Status,
  Switch,
  Tabs,
} from '@leverui/components';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const palettes = ['cyan', 'purple', 'orange', 'green'] as const;
const serverSteps = [
  'HTML arrives from the server',
  'Styles apply before scripts load',
  'Controls respond after hydration',
] as const;

/** Tabs you can drive from the keyboard, with a legend that says what each key does. */
export function KeyboardDemo(): JSX.Element {
  return (
    <div class="feature-demo-stack">
      <Tabs.Root defaultValue="profile" size="sm" colorPalette="cyan">
        <Tabs.List aria-label="Account sections">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          <Tabs.Trigger value="team">Team</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <dl class="feature-keys">
        <div>
          <dt>
            <Kbd>←</Kbd>
            <Kbd>→</Kbd>
          </dt>
          <dd>Switch tabs</dd>
        </div>
        <div>
          <dt>
            <Kbd>Home</Kbd>
            <Kbd>End</Kbd>
          </dt>
          <dd>First or last tab</dd>
        </div>
      </dl>
    </div>
  );
}

/** Color swatches that recolor a few components at once. */
export function ThemeDemo(): JSX.Element {
  const [palette, setPalette] = createSignal<(typeof palettes)[number]>('cyan');

  return (
    <div class="feature-demo-stack">
      <div class="feature-demo-row" role="group" aria-label="Accent color">
        <For each={palettes}>
          {/** Offer one accent color. */}
          {(name) => (
            <button
              type="button"
              class="feature-swatch"
              style={{ background: `var(--leverui-colors-${name}-solid)` }}
              aria-label={name}
              aria-pressed={palette() === name ? 'true' : 'false'}
              onClick={
                /** Recolor the preview with this accent. */
                () => setPalette(name)
              }
            />
          )}
        </For>
      </div>
      <div class="feature-demo-row">
        <Button type="button" size="sm" colorPalette={palette()}>
          Save
        </Button>
        <Badge colorPalette={palette()}>New</Badge>
        <Switch.Root size="sm" defaultChecked colorPalette={palette()} aria-label="Sample switch">
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      </div>
      <Progress.Root value={70} size="sm" colorPalette={palette()} aria-label="Sample progress">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </div>
  );
}

/** One small panel, drawn in each color mode. */
function ModePanel(props: { label: string }): JSX.Element {
  return (
    <div class="feature-mode-panel">
      <span>{props.label}</span>
      <Button type="button" size="xs" colorPalette="cyan">
        Save
      </Button>
    </div>
  );
}

/** The same content in light mode and in dark mode, side by side. */
export function ColorModeDemo(): JSX.Element {
  return (
    <div class="feature-mode-pair">
      <LightMode>
        <ModePanel label="Light" />
      </LightMode>
      <DarkMode>
        <ModePanel label="Dark" />
      </DarkMode>
    </div>
  );
}

/** The three things that happen, in order, when a server-rendered page loads. */
export function ServerDemo(): JSX.Element {
  return (
    <div class="feature-demo-stack">
      <For each={serverSteps}>
        {/** Show one step as done. */}
        {(step) => (
          <Status.Root colorPalette="green" size="sm">
            <Status.Indicator />
            {step}
          </Status.Root>
        )}
      </For>
    </div>
  );
}
