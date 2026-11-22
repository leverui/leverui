import {
  Editable,
  useEditable,
  type EditablePreviewProps,
  type EditableRootProps,
  type EditableRootProviderProps,
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

export type NativeRootRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLDivElement) => void }, EditableRootProps>
>;
export type SelectedAnchorAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: '#name' }, EditablePreviewProps<'a'>>
>;
export type ProviderValueRequired = ExpectFalse<
  Assignable<{ value?: never }, EditableRootProviderProps>
>;
export type ChildAndSelectedTagRejected = ExpectFalse<
  Assignable<
    { as: 'a'; asChild: NonNullable<EditablePreviewProps['asChild']> },
    EditablePreviewProps<'a'>
  >
>;
export type ObjectCssRemoved = ExpectFalse<'css' extends keyof EditableRootProps ? true : false>;
export type RecipePropRemoved = ExpectFalse<
  'recipe' extends keyof EditableRootProps ? true : false
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ class: string; style: string }, EditableRootProps>
>;

/** Compile a caller-owned machine through installed declarations. */
export function typedEditable(): JSX.Element {
  const editable = useEditable({ defaultValue: 'Name' });
  return (
    <Editable.RootProvider value={editable}>
      <Editable.Preview as="a" href="#name" />
      <Editable.Textarea />
    </Editable.RootProvider>
  );
}
