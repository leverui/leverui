import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Radiomark, Theme } from '../src';

/** Show Radiomark states, finite CSS options, and live Solid updates. */
export function RadiomarkContractExample(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const [large, setLarge] = createSignal(false);

  /** Change all reactive visual options without replacing the root span. */
  function toggleMark(): void {
    setChecked(!checked());
    setDisabled(!disabled());
    setLarge(!large());
  }

  return (
    <>
      <div style={{ display: 'grid', gap: '18px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Radiomark data-testid="radiomark-unchecked" />
          <Radiomark checked data-testid="radiomark-checked" />
          <Radiomark disabled data-testid="radiomark-disabled" />
          <Radiomark checked disabled data-testid="radiomark-checked-disabled" />
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Radiomark checked variant="solid" data-testid="radiomark-solid" />
          <Radiomark checked variant="subtle" data-testid="radiomark-subtle" />
          <Radiomark checked variant="outline" data-testid="radiomark-outline" />
          <Radiomark checked variant="inverted" data-testid="radiomark-inverted" />
          <Radiomark checked variant="outline" filled data-testid="radiomark-filled" />
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Radiomark checked size="xs" data-testid="radiomark-xs" />
          <Radiomark checked size="sm" data-testid="radiomark-sm" />
          <Radiomark checked size="md" data-testid="radiomark-md" />
          <Radiomark checked size="lg" data-testid="radiomark-lg" />
          <Radiomark checked size={{ base: 'xs', md: 'lg' }} data-testid="radiomark-responsive" />
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Radiomark checked colorPalette="teal" data-testid="radiomark-teal" />
          <Radiomark checked colorPalette="red" data-testid="radiomark-red" />
          <Theme appearance="dark" hasBackground={false}>
            <Radiomark checked colorPalette="blue" data-testid="radiomark-dark" />
          </Theme>
        </div>
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'center' }}>
          <Radiomark
            checked={checked()}
            disabled={disabled()}
            size={large() ? 'lg' : 'xs'}
            data-testid="radiomark-reactive"
          />
          <button type="button" onClick={toggleMark} data-testid="radiomark-toggle">
            Change Radiomark
          </button>
        </div>
      </div>
    </>
  );
}
