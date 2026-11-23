import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Span, Stack, TagsInput } from '../../src';
import { tagsInputGuideColor } from '../tags-input-guide-color';

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;
const longEmails = [
  'verylongemailaddressthatdoesnthavespaces@example.com',
  'anothersuperlongemailaddresswithoutanyspaceswhatsoever@verylongdomainname.com',
  'short@email.com',
  'mediumlengthemail@domain.co.uk',
  'extremelylongemailaddressthatshouldtruncateproperly@verylongdomainname.example.com',
];

/** Give every tag a stable light color based on its text. */
export function TagsInputColors(): JSX.Element {
  return (
    <TagsInput.Root defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}>
      <TagsInput.Label>Colored tags</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Context>
          {
            /** Keep each colored tag tied to live tag values. */
            (api) => (
              <For keyed={false} each={api().value}>
                {
                  /** Render duplicate text with distinct machine indexes. */
                  (tag, index) => (
                    <TagsInput.Item index={index} value={tag()}>
                      <TagsInput.ItemPreview
                        class="tags-input-colored-preview"
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
        <TagsInput.Input placeholder="Add tag..." />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Compare all four tag input sizes. */
export function TagsInputSizes(): JSX.Element {
  return (
    <Stack>
      <For each={sizes}>
        {
          /** Give each read-only size its own tag machine. */
          (size) => (
            <TagsInput.Root
              size={size}
              readOnly
              defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}
            >
              <TagsInput.Label>{`Tags (size=${size})`}</TagsInput.Label>
              <TagsInput.Control>
                <TagsInput.Items />
                <TagsInput.Input placeholder="Add tag..." />
              </TagsInput.Control>
              <Span
                textStyle="xs"
                style={{
                  color: 'var(--lui-colors-fg-muted)',
                  'margin-inline-start': 'auto',
                }}
              >
                Press Enter or Return to add a tag
              </Span>
            </TagsInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the outline, subtle, and flushed control variants. */
export function TagsInputVariants(): JSX.Element {
  return (
    <Stack>
      <For each={variants}>
        {
          /** Give each read-only variant its own tag machine. */
          (variant) => (
            <TagsInput.Root
              variant={variant}
              readOnly
              defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}
            >
              <TagsInput.Label>{`Tags (variant=${variant})`}</TagsInput.Label>
              <TagsInput.Control>
                <TagsInput.Items />
                <TagsInput.Input placeholder="Add tag..." />
              </TagsInput.Control>
              <Span
                textStyle="xs"
                style={{
                  color: 'var(--lui-colors-fg-muted)',
                  'margin-inline-start': 'auto',
                }}
              >
                Press Enter or Return to add a tag
              </Span>
            </TagsInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Constrain the five email tags to test truncation. */
export function TagsInputLongTags(): JSX.Element {
  return (
    <TagsInput.Root class="tags-input-long-tags" defaultValue={longEmails}>
      <TagsInput.Label>Email addresses</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add email address..." />
      </TagsInput.Control>
      <Span
        textStyle="xs"
        style={{
          color: 'var(--lui-colors-fg-muted)',
          'margin-inline-start': 'auto',
        }}
      >
        Long tags are cut short with an ellipsis
      </Span>
    </TagsInput.Root>
  );
}
