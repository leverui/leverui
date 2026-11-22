import { createUniqueId, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Box,
  Button,
  Clipboard,
  Combobox,
  Field,
  IconButton,
  Input,
  Stack,
  TagsInput,
  useFilter,
  useListCollection,
} from '../../src';
import './tags-input-integrations.css';

/** Join the Combobox suggestions to one native tag input. */
export function TagsInputCombobox(): JSX.Element {
  const id = createUniqueId();
  const ids = {
    label: `tags-label-${id}`,
    input: `tags-input-${id}`,
    control: `tags-control-${id}`,
  };
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: ['SolidJS', 'Lever UI', 'TypeScript', 'Next.js', 'Vite', 'Vitest'],
    filter:
      /** Match suggestions without regard to case. */
      (value, query) => matcher().contains(value, query),
  });
  const tags = TagsInput.useTagsInput({ ids, defaultValue: [] });

  const combobox = Combobox.useCombobox(
    /** Read the current collection each time the Combobox machine updates. */
    () => ({
      ids,
      collection: collection(),
      value: [],
      allowCustomValue: true,
      selectionBehavior: 'clear',
      onInputValueChange:
        /** Keep suggestions aligned with the shared native input. */
        (details) => filter(details.inputValue),
      onValueChange:
        /** Add the chosen suggestion to the Tags Input machine. */
        (details) => {
          if (details.value[0]) tags().addValue(details.value[0]);
        },
    }),
  );

  return (
    <Combobox.RootProvider value={combobox}>
      <TagsInput.RootProvider value={tags} data-testid="tags-example-combobox">
        <TagsInput.Label id={ids.label}>Tags</TagsInput.Label>
        <Combobox.Control
          unstyled
          asChild={
            /** Render the Combobox control as the TagsInput control, its popup anchor. */
            (getControlProps) => (
              <TagsInput.Control {...getControlProps()}>
                <TagsInput.Items />
                <Combobox.Input
                  unstyled
                  asChild={
                    /** Merge both machines' props onto one focusable input. */
                    (getProps) => <TagsInput.Input {...getProps()} placeholder="Add tag..." />
                  }
                />
              </TagsInput.Control>
            )
          }
        />
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Render each filtered suggestion with its indicator. */
                  (item) => (
                    <Combobox.Item item={item} data-testid={`tags-example-suggestion-${item}`}>
                      <Combobox.ItemText>{item}</Combobox.ItemText>
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  )
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </TagsInput.RootProvider>
    </Combobox.RootProvider>
  );
}

/** Display the copy string and copy trigger above the paste control. */
function SampleClipboard(): JSX.Element {
  return (
    <Clipboard.Root value="SolidJS,Lever UI,TypeScript">
      <Box textStyle="sm" class="example-tags-input-copy-label">
        Copy tags
      </Box>
      <Clipboard.ValueText class="example-tags-input-copy-value" />
      <Clipboard.Trigger
        asChild={
          /** Keep clipboard activation on the surface icon button. */
          (getProps) => (
            <IconButton {...getProps()} variant="surface" size="2xs">
              <Clipboard.Indicator />
            </IconButton>
          )
        }
      />
    </Clipboard.Root>
  );
}

/** Add comma-separated values from a clipboard paste. */
export function TagsInputPaste(): JSX.Element {
  return (
    <Stack gap="8">
      <SampleClipboard />
      <TagsInput.Root addOnPaste delimiter=",">
        <TagsInput.Label>Paste tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Paste" />
          <TagsInput.ClearTrigger />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
    </Stack>
  );
}

/** Submit the native title and serialized categories form fields. */
export function TagsInputForm(): JSX.Element {
  /** Log the same FormData fields as the story. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw new TypeError('Expected a form.');
    const formData = new FormData(form);
    console.log('Submitted formData:', {
      title: formData.get('title'),
      categories: formData.get('categories'),
    });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Title</Field.Label>
          <Input name="title" />
        </Field.Root>
        <Field.Root>
          <TagsInput.Root name="categories">
            <TagsInput.Label>Categories</TagsInput.Label>
            <TagsInput.Control>
              <TagsInput.Items />
              <TagsInput.Input placeholder="Add tag..." />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
          </TagsInput.Root>
          <Field.HelperText>Add frameworks and libraries you use</Field.HelperText>
        </Field.Root>
        <Button type="submit" variant="solid" class="example-tags-input-submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}

/** Control the visible tags through a caller-owned store. */
export function TagsInputStore(): JSX.Element {
  const tags = TagsInput.useTagsInput();
  /** Clear the same store used by the compound tag control. */
  function clearAll(): void {
    tags().clearValue();
  }

  return (
    <Stack align="flex-start" gap="4">
      <TagsInput.RootProvider value={tags}>
        <TagsInput.Label>Tags: {JSON.stringify(tags().value)}</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add tag..." />
        </TagsInput.Control>
      </TagsInput.RootProvider>
      <Button variant="outline" size="sm" onClick={clearAll}>
        Clear all
      </Button>
    </Stack>
  );
}
