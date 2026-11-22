import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Combobox as ComboboxExport,
  Field as FieldExport,
  TagsInput as TagsInputExport,
  useFilter as UseFilterExport,
  useListCollection as UseListCollectionExport,
} from '../src';
import { tagsInputGuideColor } from '../demos/tags-input-guide-color';
import { TagsInputGuideComboboxExample } from './tags-input-guide-combobox-example';

export type TagsInputGuideHydrationComponents = {
  Combobox: typeof ComboboxExport;
  Field: typeof FieldExport;
  TagsInput: typeof TagsInputExport;
  useFilter: typeof UseFilterExport;
  useListCollection: typeof UseListCollectionExport;
};

/** Render the same guide compositions on the server and in the browser. */
export function renderTagsInputGuideHydrationTree({
  Combobox,
  Field,
  TagsInput,
  useFilter,
  useListCollection,
}: TagsInputGuideHydrationComponents): JSX.Element {
  return (
    <>
      <main id="hydrated-tags-guide">
        <TagsInput.Root defaultValue={['SolidJS', 'Lever UI']} name="colored-frameworks">
          <TagsInput.Label>Colored tags</TagsInput.Label>
          <TagsInput.Control data-testid="hydrated-tags-guide-colors">
            <TagsInput.Context>
              {
                /** Use live machine values rather than a server-only list. */
                (api) => (
                  <For keyed={false} each={api().value}>
                    {
                      /** Keep a value's color stable when a preceding tag changes. */
                      (tag, index) => (
                        <TagsInput.Item index={index} value={tag()}>
                          <TagsInput.ItemPreview
                            style={{ 'background-color': tagsInputGuideColor(tag()) }}
                          >
                            <TagsInput.ItemText>{tag()}</TagsInput.ItemText>
                            <TagsInput.ItemDeleteTrigger />
                          </TagsInput.ItemPreview>
                          <TagsInput.ItemInput />
                        </TagsInput.Item>
                      )
                    }
                  </For>
                )
              }
            </TagsInput.Context>
            <TagsInput.Input placeholder="Add colored tag" />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
        <Field.Root>
          <TagsInput.Root name="categories" defaultValue={['Solid']}>
            <TagsInput.Label>Categories</TagsInput.Label>
            <TagsInput.Control data-testid="hydrated-tags-guide-field">
              <TagsInput.Items />
              <TagsInput.Input
                placeholder="Add category"
                aria-describedby="hydrated-tags-guide-help"
              />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
          </TagsInput.Root>
          <Field.HelperText id="hydrated-tags-guide-help">Add project categories</Field.HelperText>
        </Field.Root>
        <TagsInputGuideComboboxExample
          components={{ Combobox, TagsInput, useFilter, useListCollection }}
          ids={{
            label: 'hydrated-tags-guide-combo-label',
            input: 'hydrated-tags-guide-combo-input',
            control: 'hydrated-tags-guide-combo-control',
          }}
          initialTags={['SolidJS']}
          label="Suggested tags"
          testIds={{
            root: 'hydrated-tags-guide-combo-root',
            suggestionPrefix: 'hydrated-suggestion',
          }}
        />
      </main>
    </>
  );
}
