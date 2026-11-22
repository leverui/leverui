import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Input, InputGroup } from '../src';

/** Supply one CSS height variable for a consumer-owned input. */
function CustomField(): JSX.Element {
  return (
    <input
      class="leverui-input-group__field"
      aria-label="Custom username"
      style={{ height: '40px' }}
    />
  );
}

/** Exercise editable fields with live adornments and joined addons. */
function InputGroupContractExample(): JSX.Element {
  const [offset, setOffset] = createSignal('0px');
  const [showEnd, setShowEnd] = createSignal(true);

  /** Change group padding without replacing the native input. */
  function toggleOffset(): void {
    setOffset(offset() === '0px' ? '4px' : '0px');
  }

  /** Add or remove the end adornment around the same input. */
  function toggleEnd(): void {
    setShowEnd(!showEnd());
  }

  return (
    <div style={{ width: '320px', display: 'grid', gap: '16px' }}>
      <InputGroup
        data-testid="input-group-elements"
        startElement="https://"
        startOffset={offset()}
        endElement={showEnd() ? '.com' : undefined}
        endOffset="2px"
      >
        <Input aria-label="Website" placeholder="example" />
      </InputGroup>
      <InputGroup data-testid="input-group-addons" startAddon="https://" endAddon="USD">
        <Input aria-label="Amount" type="number" />
      </InputGroup>
      <InputGroup startElement="@">
        <CustomField />
      </InputGroup>
      <InputGroup startElement="@" startOffset={4}>
        <Input aria-label="Token offset" />
      </InputGroup>
      <InputGroup
        data-testid="input-group-interactive"
        startElement="@"
        startElementProps={{ style: { 'pointer-events': 'auto' } }}
      >
        <Input aria-label="Interactive adornment" />
      </InputGroup>
      <InputGroup
        data-testid="input-group-responsive"
        startElement="@"
        startOffset={{ base: 0, md: 4 }}
      >
        <Input aria-label="Responsive offset" />
      </InputGroup>
      <button type="button" onClick={toggleOffset} data-testid="input-group-offset-toggle">
        Toggle offset
      </button>
      <button type="button" onClick={toggleEnd} data-testid="input-group-end-toggle">
        Toggle end element
      </button>
    </div>
  );
}

const meta = {
  title: 'Components/Input Group',
  component: InputGroupContractExample,
} satisfies Meta<typeof InputGroupContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
