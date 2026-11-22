import {
  Popover,
  PopoverContent,
  PopoverRoot,
  PopoverRootProvider,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverRootProps,
  type PopoverRootProviderProps,
  type UsePopoverReturn,
  usePopover,
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

export type ControlledOpenAccepted = ExpectTrue<
  Assignable<{ open: true; positioning: { placement: 'bottom-start' } }, PopoverRootProps>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, PopoverRootProps>
>;
export type NativeContentStyleAccepted = ExpectTrue<
  Assignable<{ class: string; style: { color: string } }, PopoverContentProps>
>;
export type ContentCssObjectRejected = ExpectFalse<
  'css' extends keyof PopoverContentProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<Assignable<{ recipe: object }, PopoverRootProps>>;
export type ProviderRequiresMachine = ExpectFalse<
  Assignable<{ lazyMount: true }, PopoverRootProviderProps>
>;
export type ProviderAcceptsMachine = ExpectTrue<
  Assignable<{ value: UsePopoverReturn; lazyMount: true }, PopoverRootProviderProps>
>;
export type ProviderAcceptsPresence = ExpectTrue<
  Assignable<{ value: UsePopoverReturn; present: true }, PopoverRootProviderProps>
>;
type SelectedAnchor = Parameters<typeof PopoverTrigger<'a'>>[0];
export type AnchorRefAccepted = ExpectTrue<
  Assignable<{ as: 'a'; ref: (element: HTMLAnchorElement) => void }, SelectedAnchor>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedAnchor>
>;

/** Receive the selected native anchor from the public trigger. */
function captureAnchor(element: HTMLAnchorElement): void {
  void element;
}

/** Exercise owned and caller-owned Popover modes from the installed entry. */
export function PopoverConsumer(): JSX.Element {
  const popover = usePopover({ defaultOpen: false });
  return (
    <>
      <PopoverRoot size="lg">
        <PopoverTrigger as="a" href="#details" ref={captureAnchor}>
          Details
        </PopoverTrigger>
        <PopoverContent class="account-popover" style={{ color: 'white' }}>
          Account details
        </PopoverContent>
      </PopoverRoot>
      <PopoverRootProvider value={popover} lazyMount present>
        <Popover.Trigger value="more">More</Popover.Trigger>
        <Popover.Content>
          <Popover.Body>More details</Popover.Body>
          <Popover.CloseTrigger>Close</Popover.CloseTrigger>
        </Popover.Content>
      </PopoverRootProvider>
    </>
  );
}
