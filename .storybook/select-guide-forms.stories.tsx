import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Field, Portal, Select, type SelectValueChangeDetails } from '../src';

const frameworks = Select.createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'SolidJS', value: 'solid' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});

/** Render the shared form collection without introducing another state owner. */
function FormOptions(): JSX.Element {
  return (
    <For each={frameworks.items}>
      {
        /** Bind each visible option to its collection item. */
        (item) => (
          <Select.Item item={item}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        )
      }
    </For>
  );
}

/** Keep trigger and popup anatomy identical across both form strategies. */
function FormParts(props: { testId: string }): JSX.Element {
  return (
    <>
      <Select.HiddenSelect />
      <Select.Label>Framework</Select.Label>
      <Select.Control>
        <Select.Trigger data-testid={props.testId}>
          <Select.ValueText placeholder="Select framework" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <FormOptions />
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </>
  );
}

/** Show an uncontrolled Select submitting through native FormData. */
function NativeFormGuide(): JSX.Element {
  const [submitted, setSubmitted] = createSignal('');

  /** Read the browser's real hidden-select value at submit time. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      throw new Error('Native Select guide submit target must be a form.');
    }
    setSubmitted(String(new FormData(event.currentTarget).get('framework') ?? ''));
  }

  return (
    <>
      <form onSubmit={submit} data-testid="select-native-guide-form" style={{ width: '320px' }}>
        <Select.Root collection={frameworks} name="framework" size="sm">
          <FormParts testId="select-native-guide-trigger" />
        </Select.Root>
        <Button type="submit">Submit native form</Button>
        <output data-testid="select-native-guide-result">{submitted()}</output>
      </form>
    </>
  );
}

/** Keep form selection in Solid-owned controlled state. */
function ControlledFormGuide(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);
  const [invalid, setInvalid] = createSignal(false);
  const [touched, setTouched] = createSignal(false);
  const [submitted, setSubmitted] = createSignal('');

  /** Keep the Select machine and form signal synchronized. */
  function changeValue(details: SelectValueChangeDetails): void {
    setValue(details.value);
    setInvalid(false);
  }

  /** Tell the Solid form controller when selection loses its interaction boundary. */
  function markTouched(): void {
    setTouched(true);
  }

  /** Validate the controlled choice before accepting a form submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    if (value().length === 0) {
      setInvalid(true);
      return;
    }
    setSubmitted(value()[0] ?? '');
  }

  return (
    <>
      <form
        onSubmit={submit}
        data-testid="select-controlled-guide-form"
        data-touched={String(touched())}
        style={{ width: '320px' }}
      >
        <Field.Root invalid={invalid()}>
          <Select.Root
            collection={frameworks}
            name="framework"
            value={value()}
            onValueChange={changeValue}
            onInteractOutside={markTouched}
            invalid={invalid()}
          >
            <FormParts testId="select-controlled-guide-trigger" />
          </Select.Root>
          <Show when={invalid()}>
            <Field.ErrorText>Framework is required</Field.ErrorText>
          </Show>
        </Field.Root>
        <Button type="submit">Submit controlled form</Button>
        <output data-testid="select-controlled-guide-result">{submitted()}</output>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select Guide Forms',
  component: NativeFormGuide,
} satisfies Meta<typeof NativeFormGuide>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Native: Story = { render: NativeFormGuide };
export const Controlled: Story = { render: ControlledFormGuide };
