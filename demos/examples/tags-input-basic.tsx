import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Stack, TagsInput } from '../../src';

/** Show the default tag control and keyboard hint. */
export function TagsInputBasic(): JSX.Element {
  return (
    <TagsInput.Root defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}>
      <TagsInput.Label>Tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add tag..." />
      </TagsInput.Control>
      <Span
        textStyle="xs"
        style={{
          color: 'var(--leverui-colors-fg-muted)',
          'margin-inline-start': 'auto',
        }}
      >
        Press Enter or Return to add a tag
      </Span>
    </TagsInput.Root>
  );
}

/** Follow tag changes through a caller-owned Solid signal. */
export function TagsInputControlled(): JSX.Element {
  const [tags, setTags] = createSignal<string[]>(['SolidJS', 'Lever UI']);

  return (
    <TagsInput.Root
      value={tags()}
      onValueChange={
        /** Keep the caller's values aligned with the machine. */
        (details) => setTags(details.value)
      }
    >
      <TagsInput.Label>Tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add tag..." />
      </TagsInput.Control>
    </TagsInput.Root>
  );
}

/** Allow highlighted tags to be edited inline. */
export function TagsInputEditable(): JSX.Element {
  return (
    <TagsInput.Root editable defaultValue={['SolidJS', 'Lever UI']}>
      <TagsInput.Label>Edit tags inline</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add or edit tags..." />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <Span
        textStyle="xs"
        style={{
          color: 'var(--leverui-colors-fg-muted)',
          'margin-inline-start': 'auto',
        }}
      >
        Use the arrow keys to pick a tag, then press Enter to edit it
      </Span>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Show the compact Explorer tag composition. */
export function TagsInputExplorer(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '400px', padding: 'var(--leverui-spacing-4)' }}>
      <TagsInput.Root defaultValue={['SolidJS', 'Lever UI']}>
        <TagsInput.Label>Add tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add tag..." />
          <TagsInput.ClearTrigger />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
    </Stack>
  );
}
