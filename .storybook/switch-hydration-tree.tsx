import { type JSX } from '@solidjs/web';
import type { Switch as SwitchExport } from '../src';

export type SwitchHydrationComponents = {
  Switch: typeof SwitchExport;
};

/** Render matching labeled controls under both Switch root modes. */
export function renderSwitchHydrationTree({ Switch }: SwitchHydrationComponents): JSX.Element {
  const external = Switch.useSwitch({
    id: 'hydrated-switch-external',
    name: 'external-notifications',
    value: 'yes',
    defaultChecked: false,
  });

  return (
    <>
      <form data-testid="hydrated-switch-form">
        <Switch.Root
          id="hydrated-switch-primary"
          name="primary-notifications"
          value="yes"
          defaultChecked
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Indicator data-testid="primary-track-indicator" fallback="Primary off">
              Primary on
            </Switch.Indicator>
            <Switch.Thumb>
              <Switch.ThumbIndicator data-testid="primary-thumb-indicator" fallback="−">
                ✓
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
          <Switch.Label>Hydrated primary</Switch.Label>
        </Switch.Root>
        <Switch.RootProvider value={external}>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Indicator data-testid="external-track-indicator" fallback="External off">
              External on
            </Switch.Indicator>
            <Switch.Thumb>
              <Switch.ThumbIndicator data-testid="external-thumb-indicator" fallback="−">
                ✓
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
          <Switch.Label>Hydrated external</Switch.Label>
        </Switch.RootProvider>
      </form>
    </>
  );
}
