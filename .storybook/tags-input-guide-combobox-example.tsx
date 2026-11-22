import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  Combobox as ComboboxExport,
  TagsInput as TagsInputExport,
  useFilter as UseFilterExport,
  useListCollection as UseListCollectionExport,
} from '../src';

export type TagsInputGuideComboboxComponents = {
  Combobox: typeof ComboboxExport;
  TagsInput: typeof TagsInputExport;
  useFilter: typeof UseFilterExport;
  useListCollection: typeof UseListCollectionExport;
};

type GuideIds = { label: string; input: string; control: string };
type GuideTestIds = { root: string; control?: string; content?: string; suggestionPrefix: string };

export type TagsInputGuideComboboxProps = {
  components: TagsInputGuideComboboxComponents;
  ids: GuideIds;
  initialTags: string[];
  label: string;
  placeholder?: string;
  testIds: GuideTestIds;
};

const frameworks = ['SolidJS', 'Lever UI', 'TypeScript', 'Next.js', 'Vite', 'Vitest'];

/** Compose the public Tags Input and Combobox machines around one input. */
export function TagsInputGuideComboboxExample(props: TagsInputGuideComboboxProps): JSX.Element {
  const { Combobox, TagsInput, useFilter, useListCollection } = props.components;
  const matcher = useFilter({ sensitivity: 'base' });

  /** Filter guide choices using the current input text. */
  function contains(value: string, query: string): boolean {
    return matcher().contains(value, query);
  }

  const { collection, filter } = useListCollection({ initialItems: frameworks, filter: contains });
  const tags = TagsInput.useTagsInput({ ids: props.ids, defaultValue: props.initialTags });

  /** Keep suggestions aligned with the shared native input. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Add the chosen suggestion to the Tags Input machine. */
  function chooseSuggestion(details: { value: string[] }): void {
    const value = details.value[0];
    if (value) tags().addValue(value);
  }

  /** Read the current collection each time the Combobox machine updates. */
  function comboboxProps() {
    return {
      ids: props.ids,
      collection: collection(),
      value: [],
      allowCustomValue: true,
      selectionBehavior: 'clear' as const,
      onInputValueChange: changeInput,
      onValueChange: chooseSuggestion,
    };
  }

  const combobox = Combobox.useCombobox(comboboxProps);

  return (
    <Combobox.RootProvider value={combobox}>
      <TagsInput.RootProvider value={tags} data-testid={props.testIds.root}>
        {/* Zag 2 writes no label id itself; the Combobox list is labelled by this id. */}
        <TagsInput.Label id={props.ids.label}>{props.label}</TagsInput.Label>
        {/* Zag 2 finds the popup anchor by Combobox's control part, not by a shared id. */}
        <Combobox.Control
          unstyled
          asChild={
            /** Render the Combobox control as the TagsInput control. */
            (getControlProps) => (
              <TagsInput.Control {...getControlProps()} data-testid={props.testIds.control}>
                <TagsInput.Items />
                <Combobox.Input
                  unstyled
                  asChild={
                    /** Merge both machines' props onto one focusable input. */
                    (getProps) => (
                      <TagsInput.Input
                        {...getProps()}
                        placeholder={props.placeholder ?? 'Add suggested tag'}
                      />
                    )
                  }
                />
              </TagsInput.Control>
            )
          }
        />
        <Combobox.Positioner>
          <Combobox.Content data-testid={props.testIds.content}>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Render each filtered suggestion with its indicator. */
                  (item) => (
                    <Combobox.Item
                      item={item}
                      data-testid={`${props.testIds.suggestionPrefix}-${item}`}
                    >
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
