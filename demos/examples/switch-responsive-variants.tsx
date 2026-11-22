import { type JSX } from '@solidjs/web';
import { Switch } from '../../src';

/** Show object and sparse-array Switch variants across viewport breakpoints. */
export function SwitchResponsiveVariantsExample(): JSX.Element {
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <Switch.Root
          variant={{
            base: 'solid',
            sm: 'raised',
            md: 'solid',
            lg: 'raised',
            xl: 'solid',
            '2xl': 'raised',
          }}
          data-testid="switch-responsive-variant-object"
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Object variants</Switch.Label>
        </Switch.Root>
        <Switch.Root
          variant={['raised', null, 'solid']}
          data-testid="switch-responsive-variant-array"
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Array variants</Switch.Label>
        </Switch.Root>
        <Switch.Root variant="solid" data-testid="switch-variant-solid-reference">
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Solid</Switch.Label>
        </Switch.Root>
        <Switch.Root variant="raised" data-testid="switch-variant-raised-reference">
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>Raised</Switch.Label>
        </Switch.Root>
      </div>
    </>
  );
}
