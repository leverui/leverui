import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, Field, Input, Stack, TagsInput } from '../src';

/** Compose a Tags Input with Field help and native form submission. */
function TagsInputGuideForm(): JSX.Element {
  const [submitted, setSubmitted] = createSignal('');

  /** Read the same native fields a consumer receives on submission. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw new TypeError('Expected a form.');
    const values = new FormData(form);
    setSubmitted(
      JSON.stringify({ title: values.get('title'), categories: values.get('categories') }),
    );
  }

  return (
    <>
      <form
        data-testid="tags-guide-form"
        onSubmit={submit}
        style={{ padding: '24px', width: '360px' }}
      >
        <Stack gap="4">
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input name="title" placeholder="Project title" />
          </Field.Root>
          <Field.Root>
            <TagsInput.Root name="categories">
              <TagsInput.Label>Categories</TagsInput.Label>
              <TagsInput.Control>
                <TagsInput.Items />
                <TagsInput.Input
                  placeholder="Add category"
                  aria-describedby="tags-guide-categories-help"
                />
              </TagsInput.Control>
              <TagsInput.HiddenInput />
            </TagsInput.Root>
            <Field.HelperText id="tags-guide-categories-help">
              Add frameworks and libraries you use
            </Field.HelperText>
          </Field.Root>
          <Button type="submit">Submit categories</Button>
          <output data-testid="tags-guide-form-result">{submitted()}</output>
        </Stack>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Guide Form',
  component: TagsInputGuideForm,
} satisfies Meta<typeof TagsInputGuideForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = { render: TagsInputGuideForm };
