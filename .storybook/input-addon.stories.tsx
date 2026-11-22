import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Group, Input, InputAddon } from '../src';

/** Compose the addon with an editable Input and changing CSS choices. */
function InputAddonContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change both controls together without replacing the native input. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <div data-testid="input-addon-contract">
        <Group attached>
          <InputAddon size={large() ? 'lg' : 'sm'} data-testid="input-addon-prefix">
            https://
          </InputAddon>
          <Input
            size={large() ? 'lg' : 'sm'}
            aria-label="Website"
            placeholder="example.com"
            data-testid="input-addon-control"
          />
        </Group>
        <InputAddon data-testid="input-addon-styled">Styled addon</InputAddon>
        <InputAddon
          size={{ base: 'sm', md: 'lg' }}
          variant={{ base: 'outline', md: 'subtle' }}
          data-testid="input-addon-responsive"
        >
          Responsive addon
        </InputAddon>
        <InputAddon unstyled title="Plain prefix" data-testid="input-addon-unstyled">
          Plain addon
        </InputAddon>
        <button type="button" onClick={toggleSize} data-testid="input-addon-toggle">
          Toggle size
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Input Addon',
  component: InputAddonContractExample,
} satisfies Meta<typeof InputAddonContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
