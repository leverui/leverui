import { TagsInput, type TagsInputValueChangeDetails } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed Tags Input rendering, keyboard entry, and form value. */
export function PackedTagsInput(): JSX.Element {
  const [value, setValue] = createSignal(['Solid']);

  /** Keep the consumer's controlled list synchronized with the machine. */
  function handleValueChange(details: TagsInputValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <form data-testid="packed-tags-input-form">
      <TagsInput.Root
        name="frameworks"
        value={value()}
        onValueChange={handleValueChange}
        class="packed-tags-input"
        data-testid="packed-tags-input-root"
      >
        <TagsInput.Label>Frameworks</TagsInput.Label>
        <TagsInput.Control data-testid="packed-tags-input-control">
          <TagsInput.Items />
          <TagsInput.Input
            asChild={
              /** Preserve the primitive's field attributes on a caller-owned input. */
              (getProps) => <input {...getProps()} placeholder="Add framework" />
            }
          />
          <TagsInput.ClearTrigger aria-label="Clear frameworks" />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
      <output data-testid="packed-tags-input-value">{value().join(', ')}</output>
    </form>
  );
}
