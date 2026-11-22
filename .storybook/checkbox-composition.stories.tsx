import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
} from '../src';

/** Exercise group, external machine, and selected-element APIs in the browser. */
function CheckboxCompositionExample(): JSX.Element {
  const external = useCheckbox({ defaultChecked: true, name: 'external', value: 'yes' });
  const [values, setValues] = createSignal<string[]>(['alpha']);

  /** Record group changes for browser assertions. */
  function updateValues(next: string[]): void {
    setValues(next);
  }

  return (
    <>
      <form data-testid="composition-form">
        <CheckboxGroup
          name="topics"
          aria-label="Topics"
          defaultValue={['alpha']}
          data-testid="composition-group"
          maxSelectedValues={1}
          onValueChange={updateValues}
          asChild={
            /** Keep the primitive's group attributes on a consumer-owned section. */
            (getProps) => <section {...getProps()} />
          }
        >
          <CheckboxRoot value="alpha">
            <CheckboxControl />
            <CheckboxLabel>Alpha</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
          <CheckboxRoot value="beta">
            <CheckboxControl />
            <CheckboxLabel>Beta</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </CheckboxGroup>
        <CheckboxRootProvider value={external} data-testid="external-root">
          <CheckboxControl />
          <CheckboxLabel>External</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRootProvider>
        <CheckboxRoot as="div" name="custom" value="yes" data-testid="selected-root">
          <CheckboxControl />
          <CheckboxLabel>Selected element</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRoot>
      </form>
      <output data-testid="group-values">{values().join(',')}</output>
    </>
  );
}

const meta = {
  title: 'Components/Checkbox Composition',
  component: CheckboxCompositionExample,
} satisfies Meta<typeof CheckboxCompositionExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
