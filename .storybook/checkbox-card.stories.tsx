import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Checkbox, CheckboxCard, Field } from '../src';

/** Exercise card grouping, external state, Field semantics, and live CSS choices. */
function CheckboxCardExample(): JSX.Element {
  const external = CheckboxCard.useCheckboxCard({
    defaultChecked: true,
    name: 'external',
    value: 'yes',
  });
  const [large, setLarge] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);

  /** Toggle the first card's CSS size without remounting its input. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Toggle Field validation while retaining its native control. */
  function toggleInvalid(): void {
    setInvalid(!invalid());
  }

  return (
    <>
      <form data-testid="card-form">
        <Checkbox.Group
          name="topics"
          aria-label="Topics"
          defaultValue={['alpha']}
          maxSelectedValues={1}
        >
          <CheckboxCard.Root
            class="consumer-card"
            value="alpha"
            size={large() ? 'lg' : 'sm'}
            variant="outline"
            data-testid="alpha-root"
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control class="consumer-card-control" data-testid="alpha-control">
              <CheckboxCard.Content class="consumer-card-content">
                <CheckboxCard.Label class="consumer-card-label">Alpha</CheckboxCard.Label>
                <CheckboxCard.Description class="consumer-card-description">
                  First topic
                </CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator
                class="consumer-card-indicator"
                data-testid="alpha-indicator"
              />
            </CheckboxCard.Control>
            <CheckboxCard.Addon class="consumer-card-addon">Alpha details</CheckboxCard.Addon>
          </CheckboxCard.Root>
          <CheckboxCard.Root value="beta" variant="surface">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Label>Beta</CheckboxCard.Label>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        </Checkbox.Group>
        <CheckboxCard.RootProvider value={external} data-testid="external-root">
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control>
            <CheckboxCard.Label>External</CheckboxCard.Label>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.RootProvider>
        <CheckboxCard.Root
          checked
          size={{ base: 'sm', md: 'lg' }}
          variant={{ base: 'outline', md: 'solid' }}
          data-testid="responsive-card-root"
        >
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control data-testid="responsive-card-control">
            <CheckboxCard.Label>Responsive card</CheckboxCard.Label>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
        <CheckboxCard.Root name="custom" value="yes" data-testid="custom-card-root">
          <CheckboxCard.HiddenInput
            asChild={
              /** Preserve the primitive's native input through a caller-rendered element. */
              (getProps) => <input {...getProps()} data-testid="custom-card-input" />
            }
          />
          <CheckboxCard.Control>
            <CheckboxCard.Label>Custom card</CheckboxCard.Label>
            <CheckboxCard.Indicator
              aria-hidden="false"
              asChild={
                /** Keep the custom SVG tied to the current machine state. */
                (getProps) => <svg {...getProps()} data-testid="custom-card-indicator" />
              }
            />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
        <Field.Root id="card-field" required invalid={invalid()}>
          <Field.Label>Accept terms</Field.Label>
          <CheckboxCard.Root name="terms" value="yes" data-testid="terms-root">
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Description>Required before continuing</CheckboxCard.Description>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
          <Field.HelperText>Choose to continue</Field.HelperText>
          <Field.ErrorText>You must accept</Field.ErrorText>
        </Field.Root>
      </form>
      <button type="button" onClick={toggleSize} data-testid="toggle-card-size">
        Toggle size
      </button>
      <button type="button" onClick={toggleInvalid} data-testid="toggle-card-invalid">
        Toggle validation
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Checkbox Card',
  component: CheckboxCardExample,
} satisfies Meta<typeof CheckboxCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
