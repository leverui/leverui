import {
  Tooltip,
  TooltipContent,
  TooltipRoot,
  TooltipRootProvider,
  TooltipTrigger,
  type TooltipContentProps,
  type TooltipRootProps,
  type TooltipRootProviderProps,
  type UseTooltipReturn,
  useTooltip,
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
  Assignable<{ open: true; positioning: { placement: 'bottom-start' } }, TooltipRootProps>
>;
export type ProviderRequiresMachine = ExpectFalse<
  Assignable<{ lazyMount: true }, TooltipRootProviderProps>
>;
export type ProviderAcceptsMachine = ExpectTrue<
  Assignable<{ value: UseTooltipReturn; lazyMount: true; present: true }, TooltipRootProviderProps>
>;
type SelectedAnchor = Parameters<typeof TooltipTrigger<'a'>>[0];
export type AnchorRefAccepted = ExpectTrue<
  Assignable<{ as: 'a'; ref: (element: HTMLAnchorElement) => void }, SelectedAnchor>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedAnchor>
>;
export type NativeContentStyleAccepted = ExpectTrue<
  Assignable<{ class: string; style: { color: string } }, TooltipContentProps>
>;
export type ContentCssObjectRejected = ExpectFalse<
  'css' extends keyof TooltipContentProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<Assignable<{ recipe: object }, TooltipRootProps>>;

/** Receive the selected native anchor from the public trigger. */
function captureAnchor(element: HTMLAnchorElement): void {
  void element;
}

/** Exercise owned and caller-owned Tooltip modes from the installed entry. */
export function TooltipConsumer(): JSX.Element {
  const tooltip = useTooltip({ defaultOpen: false });
  return (
    <>
      <TooltipRoot openDelay={0} positioning={{ placement: 'bottom-start' }}>
        <TooltipTrigger as="a" href="#details" ref={captureAnchor}>
          Details
        </TooltipTrigger>
        <TooltipContent class="account-tooltip" style={{ color: 'white' }}>
          Account details
        </TooltipContent>
      </TooltipRoot>
      <TooltipRootProvider value={tooltip} lazyMount present>
        <Tooltip.Trigger value="more">More</Tooltip.Trigger>
        <Tooltip.Content>More details</Tooltip.Content>
      </TooltipRootProvider>
    </>
  );
}
