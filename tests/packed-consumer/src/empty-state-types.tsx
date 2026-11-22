import {
  EmptyState,
  type EmptyStateRootProps,
  type EmptyStateTitleProps,
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

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, EmptyStateRootProps>>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, EmptyStateRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, EmptyStateRootProps>>;
export type NativeTitleRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLHeadingElement) => void }, EmptyStateTitleProps>
>;
export type SelectedTitleRefAccepted = ExpectTrue<
  Assignable<
    { as: 'button'; ref: (element: HTMLButtonElement) => void },
    EmptyStateTitleProps<'button'>
  >
>;
export type WrongTitleRefRejected = ExpectFalse<
  Assignable<
    { as: 'button'; ref: (element: HTMLHeadingElement) => void },
    EmptyStateTitleProps<'button'>
  >
>;

/** Compile the compound namespace against installed declarations. */
export function typedEmptyState(): JSX.Element {
  return (
    <EmptyState.Root as="section" size="md" role="status">
      <EmptyState.Content>
        <EmptyState.Title>No items</EmptyState.Title>
        <EmptyState.Description>Add an item to begin.</EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
