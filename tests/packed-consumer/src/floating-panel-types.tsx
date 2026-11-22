import {
  FloatingPanel,
  FloatingPanelContent,
  FloatingPanelResizeTriggers,
  FloatingPanelRoot,
  FloatingPanelRootProvider,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
  type FloatingPanelOpenChangeDetails,
  type FloatingPanelContentProps,
  type FloatingPanelRootProps,
  type FloatingPanelRootProviderProps,
  type UseFloatingPanelReturn,
  useFloatingPanel,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';
import type * as PublicApi from '@leverui/components';

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
type PublicModule = typeof PublicApi;

export type FloatingPanelStylesHookRemoved = ExpectFalse<
  'useFloatingPanelStyles' extends keyof PublicModule ? true : false
>;
export type FloatingPanelRecipeRemoved = ExpectFalse<
  'recipe' extends keyof FloatingPanelRootProps ? true : false
>;
export type FloatingPanelObjectCssRemoved = ExpectFalse<
  'css' extends keyof FloatingPanelContentProps ? true : false
>;
export type FloatingPanelStylePropsRemoved = ExpectFalse<
  'bg' extends keyof FloatingPanelContentProps ? true : false
>;
export type FloatingPanelNativeStyleAccepted = ExpectTrue<
  'style' extends keyof FloatingPanelContentProps ? true : false
>;

export type InitialSizeAccepted = ExpectTrue<
  Assignable<{ defaultSize: { width: number; height: number } }, FloatingPanelRootProps>
>;
export type EscapeOptionAccepted = ExpectTrue<
  Assignable<{ closeOnEscape: true }, FloatingPanelRootProps>
>;
export type ProviderRequiresMachine = ExpectFalse<
  Assignable<{ lazyMount: true }, FloatingPanelRootProviderProps>
>;
export type ProviderAcceptsMachine = ExpectTrue<
  Assignable<{ value: UseFloatingPanelReturn; lazyMount: true }, FloatingPanelRootProviderProps>
>;
type SelectedTitle = Parameters<typeof FloatingPanelTitle<'h3'>>[0];
type SelectedAnchor = Parameters<typeof FloatingPanelTrigger<'a'>>[0];
export type CorrectTitleRefAccepted = ExpectTrue<
  Assignable<{ as: 'h3'; ref: (element: HTMLHeadingElement) => void }, SelectedTitle>
>;
export type CorrectAnchorRefAccepted = ExpectTrue<
  Assignable<{ as: 'a'; ref: (element: HTMLAnchorElement) => void }, SelectedAnchor>
>;
export type WrongTitleRefRejected = ExpectFalse<
  Assignable<{ as: 'h3'; ref: (element: HTMLButtonElement) => void }, SelectedTitle>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedAnchor>
>;
/** Exercise the installed open callback contract. */
function onOpenChange(details: FloatingPanelOpenChangeDetails): void {
  const open: boolean = details.open;
  void open;
}

/** Receive the selected heading node through the public title ref. */
function captureHeading(element: HTMLHeadingElement): void {
  void element;
}

/** Receive the selected link node through the public trigger ref. */
function captureAnchor(element: HTMLAnchorElement): void {
  void element;
}

/** Check named and namespace parts from an installed package. */
export function FloatingPanelConsumer(): JSX.Element {
  const panel = useFloatingPanel({ defaultOpen: false });
  return (
    <>
      <FloatingPanelRoot defaultSize={{ width: 320, height: 220 }} onOpenChange={onOpenChange}>
        <FloatingPanelTrigger as="a" href="#installed-panel" ref={captureAnchor}>
          Open
        </FloatingPanelTrigger>
        <FloatingPanelContent>
          <FloatingPanelTitle as="h3" ref={captureHeading}>
            Installed panel
          </FloatingPanelTitle>
          <FloatingPanelResizeTriggers axes={['s', 'e', 'se']} />
          <FloatingPanelStageTrigger stage="minimized">Minimize</FloatingPanelStageTrigger>
        </FloatingPanelContent>
      </FloatingPanelRoot>
      <FloatingPanelRootProvider value={panel} lazyMount>
        <FloatingPanel.Trigger>Open provider panel</FloatingPanel.Trigger>
        <FloatingPanel.Content>Provider panel</FloatingPanel.Content>
      </FloatingPanelRootProvider>
    </>
  );
}
