import { Splitter, type SplitterRootProps, type SplitterResizeDetails } from '@leverui/components';
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

export type PanelsAccepted = ExpectTrue<
  Assignable<{ panels: [{ id: 'a' }, { id: 'b' }]; defaultSize: [40, 60] }, SplitterRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: string }, SplitterRootProps>>;

/** Receive the first panel's size from the packaged callback contract. */
function receiveResize(details: SplitterResizeDetails): void {
  const first: number | string | undefined = details.size[0];
  void first;
}

/** Confirm compound parts and the machine callback compile in a consumer. */
export function typedSplitter(): JSX.Element {
  return (
    <Splitter.Root panels={[{ id: 'a' }, { id: 'b' }]} onResize={receiveResize}>
      <Splitter.Panel id="a">First</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">Second</Splitter.Panel>
    </Splitter.Root>
  );
}
