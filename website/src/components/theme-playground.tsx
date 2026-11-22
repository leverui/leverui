import { Badge, Button, Input, Switch, Tabs, Theme } from '@leverui/components';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { contrastTextColor } from '../lib/contrast';
import { GuideCodeBlock } from './guide-code-block';

const presets = [
  { name: 'Ocean', color: '#006f97' },
  { name: 'Forest', color: '#15803d' },
  { name: 'Orchid', color: '#9333ea' },
  { name: 'Ember', color: '#c2410c' },
] as const;

/** Let visitors adjust real CSS tokens and preview Lever UI components. */
export function ThemePlayground(): JSX.Element {
  const [color, setColor] = createSignal<string>(presets[0].color);
  const [radius, setRadius] = createSignal(8);
  const [copyStatus, setCopyStatus] = createSignal<'idle' | 'success' | 'error'>('idle');
  const contrast = createMemo(
    /** Keep preview text readable for each selected solid color. */
    () => contrastTextColor(color()),
  );
  const css = createMemo(
    /** Generate a portable override for a consumer stylesheet. */
    () =>
      `:root {\n  --leverui-colors-blue-solid: ${color()};\n  --leverui-colors-blue-contrast: ${contrast()};\n  --leverui-radii-l2: ${radius()}px;\n}`,
  );

  /** Apply a named color preset. */
  function choosePreset(value: string): void {
    setColor(value);
    setCopyStatus('idle');
  }

  /** Keep the color input synchronized with the preview. */
  function updateColor(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setColor(event.currentTarget.value);
    setCopyStatus('idle');
  }

  /** Keep the radius input synchronized with the preview. */
  function updateRadius(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setRadius(Number(event.currentTarget.value));
    setCopyStatus('idle');
  }

  /** Copy the CSS that reproduces the current theme choices. */
  async function copyCss(): Promise<void> {
    try {
      await navigator.clipboard.writeText(css());
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }

  return (
    <div class="playground-layout">
      <section class="playground-controls" aria-labelledby="playground-controls-title">
        <span class="eyebrow">THEME CONTROLS</span>
        <h2 id="playground-controls-title">Shape the details</h2>
        <p>These controls update public Lever UI CSS variables in the preview.</p>
        <fieldset>
          <legend>Accent color</legend>
          <div class="playground-swatches">
            <For each={presets}>
              {/** Offer a small range of readable starting colors. */}
              {(preset) => (
                <button
                  type="button"
                  title={preset.name}
                  aria-label={`${preset.name} accent`}
                  aria-pressed={color() === preset.color ? 'true' : 'false'}
                  style={{ 'background-color': preset.color }}
                  onClick={
                    /** Apply this preset to every preview component. */
                    () => choosePreset(preset.color)
                  }
                />
              )}
            </For>
          </div>
          <label class="playground-color-input">
            Custom color
            <input type="color" value={color()} onInput={updateColor} />
            <code>{color()}</code>
          </label>
        </fieldset>
        <label class="playground-radius-input">
          Corner radius <strong>{radius()}px</strong>
          <input type="range" min="0" max="24" value={radius()} onInput={updateRadius} />
        </label>
        <div class="playground-css-heading">
          <h3>Copy into your CSS</h3>
          <button type="button" onClick={copyCss} aria-live="polite">
            {copyStatus() === 'success'
              ? 'Copied'
              : copyStatus() === 'error'
                ? 'Copy failed'
                : 'Copy CSS'}
          </button>
        </div>
        <Show when={css()} keyed>
          {/** Highlight each CSS override as its controls change. */}
          {(code) => <GuideCodeBlock label="theme.css" showToolbar={false} source={code} />}
        </Show>
        <a class="text-link" href="/docs/theme-guide">
          Read the theme guide
        </a>
      </section>
      <Theme
        class="playground-preview"
        style={{
          '--leverui-colors-blue-solid': color(),
          '--leverui-colors-blue-contrast': contrast(),
          '--leverui-radii-l2': `${radius()}px`,
        }}
      >
        <div class="playground-preview-heading">
          <span>LIVE PREVIEW</span>
          <Badge colorPalette="blue">Workspace</Badge>
        </div>
        <div class="playground-preview-card">
          <h2>A calmer way to work</h2>
          <p>See how your theme choices carry across real components.</p>
          <label class="playground-field">
            Project name
            <Input placeholder="My next project" />
          </label>
          <div class="playground-preview-switch">
            <Switch.Root defaultChecked>
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Send me updates</Switch.Label>
            </Switch.Root>
          </div>
          <div class="playground-actions">
            <Button colorPalette="blue">Create project</Button>
            <Button colorPalette="blue" variant="outline">
              Preview
            </Button>
          </div>
          <Tabs.Root defaultValue="overview" colorPalette="blue">
            <Tabs.List aria-label="Example project views">
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">Your new workspace is ready.</Tabs.Content>
            <Tabs.Content value="activity">Activity will appear here.</Tabs.Content>
          </Tabs.Root>
        </div>
      </Theme>
    </div>
  );
}
