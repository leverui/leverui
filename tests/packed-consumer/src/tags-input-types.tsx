import {
  TagsInput,
  type TagsInputItemProps,
  type TagsInputRootProps,
  type TagsInputValueChangeDetails,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type TagsInputSizeAccepted = ExpectTrue<
  Assignable<{ size: 'lg'; variant: 'flushed' }, Pick<TagsInputRootProps, 'size' | 'variant'>>
>;
export type TagsInputItemIdentityRequired = ExpectFalse<
  Assignable<Record<string, never>, TagsInputItemProps>
>;
export type TagsInputChangeValue = ExpectTrue<
  Assignable<TagsInputValueChangeDetails['value'], string[]>
>;

/** Compile the installed external machine, provider, and compound parts. */
export function PackedTagsInputTypes(): JSX.Element {
  const machine = TagsInput.useTagsInput({ defaultValue: ['Solid'] });
  return (
    <TagsInput.PropsProvider value={{ size: 'lg', variant: 'flushed' }}>
      <TagsInput.RootProvider value={machine}>
        <TagsInput.Label>Frameworks</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Item index={0} value="Solid">
            <TagsInput.ItemPreview>
              <TagsInput.ItemText>Solid</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger />
            </TagsInput.ItemPreview>
            <TagsInput.ItemInput />
          </TagsInput.Item>
          <TagsInput.Input />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.RootProvider>
    </TagsInput.PropsProvider>
  );
}
