import { type JSX } from '@solidjs/web';
import { Field, TagsInput } from '../../src';

/** Disable tag entry and removal. */
export function TagsInputDisabled(): JSX.Element {
  return (
    <TagsInput.Root disabled defaultValue={['SolidJS', 'Lever UI']}>
      <TagsInput.Label>Disabled tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Can't type here" />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Keep the values visible without allowing edits. */
export function TagsInputReadOnly(): JSX.Element {
  return (
    <TagsInput.Root readOnly defaultValue={['SolidJS', 'Lever UI']}>
      <TagsInput.Label>Read-only tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Read-only..." />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Show field error copy for an invalid tag collection. */
export function TagsInputInvalid(): JSX.Element {
  return (
    <Field.Root invalid>
      <TagsInput.Root defaultValue={['SolidJS', 'Lever UI']}>
        <TagsInput.Label>Invalid tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add tags..." />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
      <Field.ErrorText>Add at least three tags.</Field.ErrorText>
    </Field.Root>
  );
}

/** Add field helper text beneath the tag control. */
export function TagsInputField(): JSX.Element {
  return (
    <Field.Root>
      <TagsInput.Root defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}>
        <TagsInput.Label>Enter tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add tag..." />
        </TagsInput.Control>
      </TagsInput.Root>
      <Field.HelperText>Separate tags with a comma</Field.HelperText>
    </Field.Root>
  );
}
