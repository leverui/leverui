import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, Input } from '../src';
import type { FieldOrientation } from '../src/components/field-orientation';
import './field-css.css';

/** Exercise native Field styling with responsive and unstyled selections. */
function FieldCssContract(): JSX.Element {
  const [reversed, setReversed] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);

  /** Change both the CSS orientation and the primitive validation state in place. */
  function toggle(): void {
    setReversed(!reversed());
    setInvalid(!invalid());
  }

  /** Keep the responsive Field orientation reactive without remounting. */
  function orientation(): { base: FieldOrientation; md: FieldOrientation } {
    return reversed()
      ? { base: 'horizontal', md: 'vertical' }
      : { base: 'vertical', md: 'horizontal' };
  }

  return (
    <div>
      <Field.Root
        id="css-field"
        class="field-css-custom"
        orientation={orientation()}
        invalid={invalid()}
        data-testid="field-css-root"
      >
        <Field.Label class="field-css-override-label" data-testid="field-css-label">
          CSS label
        </Field.Label>
        <Input data-testid="field-css-input" />
        <Field.HelperText>CSS helper</Field.HelperText>
        <Field.ErrorText>CSS error</Field.ErrorText>
      </Field.Root>
      <Field.Root unstyled data-testid="field-css-unstyled-root">
        <Field.Label class="field-css-unstyled-label" data-testid="field-css-unstyled-label">
          Custom label
        </Field.Label>
        <Input aria-label="Custom input" />
      </Field.Root>
      <Field.Root
        orientation={{
          base: 'vertical',
          sm: 'horizontal',
          md: 'vertical',
          lg: 'horizontal',
          xl: 'vertical',
          '2xl': 'horizontal',
        }}
        data-testid="field-css-breakpoints"
      >
        <Field.Label>Responsive label</Field.Label>
        <Input />
      </Field.Root>
      <button type="button" onClick={toggle} data-testid="field-css-toggle">
        Toggle Field
      </button>
    </div>
  );
}

const meta = {
  title: 'Components/Field CSS',
  component: FieldCssContract,
} satisfies Meta<typeof FieldCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
