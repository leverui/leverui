import { type JSX } from '@solidjs/web';
import type { TagsInput as TagsInputExport } from '../src';

export type TagsInputHydrationComponents = {
  TagsInput: typeof TagsInputExport;
};

/** Render matching server and browser tag fields with stable machine IDs. */
export function renderTagsInputHydrationTree({
  TagsInput,
}: TagsInputHydrationComponents): JSX.Element {
  return (
    <>
      <form data-testid="hydrated-tags-form">
        <TagsInput.Root
          id="hydrated-tags-input"
          name="frameworks"
          defaultValue={['Solid', 'TypeScript']}
        >
          <TagsInput.Label>Frameworks</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add framework" />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
      </form>
    </>
  );
}
