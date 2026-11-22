import { type JSX } from '@solidjs/web';
import { AbsoluteCenter, Badge, Button, HStack, Span, TagsInput, Text } from '../../src';
import './absolute-center-placements.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Show machine validation for minimum tag length. */
export function TagsInputValidation(): JSX.Element {
  return (
    <TagsInput.Root
      defaultValue={['SolidJS', 'Lever UI']}
      validate={
        /** Accept only tags with at least three characters. */
        (details) => details.inputValue.length >= 3
      }
    >
      <TagsInput.Label>Tags (at least 3 characters)</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add a tag..." />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Create a tag when focus leaves the control. */
export function TagsInputBlurBehavior(): JSX.Element {
  return (
    <TagsInput.Root blurBehavior="add">
      <TagsInput.Label>Create a tag on blur</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Type, then click away to add a tag..." />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Split typed values on semicolons and commas. */
export function TagsInputDelimiter(): JSX.Element {
  return (
    <TagsInput.Root delimiter={/[;,]/}>
      <TagsInput.Label>Custom delimiters (; ,)</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Type ; or , to add a tag..." />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Clear the initial tags from a control-positioned button. */
export function TagsInputClear(): JSX.Element {
  return (
    <TagsInput.Root defaultValue={['SolidJS', 'Lever UI', 'TypeScript']}>
      <TagsInput.Label>Tags</TagsInput.Label>
      <TagsInput.Control class="tags-input-padded-control">
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add tag..." />
        <AbsoluteCenter axis="vertical" class="absolute-center-tags-clear">
          <TagsInput.ClearTrigger />
        </AbsoluteCenter>
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

/** Trim and lowercase values before adding them to the machine. */
export function TagsInputSanitizedValue(): JSX.Element {
  return (
    <TagsInput.Root
      sanitizeValue={
        /** Normalize each submitted tag to trimmed lowercase text. */
        (value) => value.trim().toLowerCase()
      }
    >
      <TagsInput.Label>Frameworks</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder={'Try " SolidJS "'} />
      </TagsInput.Control>
      <Text
        textStyle="xs"
        style={{
          color: 'var(--leverui-colors-fg-muted)',
        }}
      >
        Tags are trimmed and converted to lowercase.
      </Text>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

/** Limit invitations to three validated email tags. */
export function TagsInputMax(): JSX.Element {
  return (
    <TagsInput.Root
      max={3}
      validate={
        /** Accept simple email addresses only. */
        (details) => emailPattern.test(details.inputValue)
      }
      defaultValue={['sage@company.com']}
    >
      <TagsInput.Label>Invite guests (max 3)</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items />
        <TagsInput.Input placeholder="Add guests" />
      </TagsInput.Control>
      <TagsInput.Context>
        {
          /** Read the current guest count directly from the machine state. */
          (api) => (
            <HStack
              justify="space-between"
              hidden={api().value.length === 0}
              style={{ 'margin-top': 'var(--leverui-spacing-2\\.5)' }}
            >
              <Span>
                You've invited <Badge>{api().value.length} / 3 guests</Badge> to your event
              </Span>
              <Button size="sm">Invite</Button>
            </HStack>
          )
        }
      </TagsInput.Context>
    </TagsInput.Root>
  );
}
