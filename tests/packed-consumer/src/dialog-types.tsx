import {
  DialogBackdrop,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogContext,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogPropsProvider,
  DialogRoot,
  DialogRootProvider,
  DialogTitle,
  DialogTrigger,
  Portal,
  type CommandDialogContentProps,
  type DialogContentProps,
  type DialogActionTriggerProps,
  type DialogOpenChangeDetails,
  type DialogRootProps,
  type DialogRootProviderProps,
  type DialogTriggerProps,
  useDialog,
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

export type DialogStyleHookRemoved = ExpectFalse<
  'useDialogStyles' extends keyof PublicModule ? true : false
>;
export type DialogNamespaceStyleHookRemoved = ExpectFalse<
  'useDialogStyles' extends keyof typeof PublicApi.Dialog ? true : false
>;
export type ControlledOpenAccepted = ExpectTrue<Assignable<{ open: true }, DialogRootProps>>;
export type InvalidDialogSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, DialogRootProps>>;
export type InvalidDialogRoleRejected = ExpectFalse<Assignable<{ role: 'menu' }, DialogRootProps>>;
export type DialogRecipeRemoved = ExpectFalse<
  'recipe' extends keyof DialogRootProps ? true : false
>;
export type DialogRootObjectCssRemoved = ExpectFalse<
  'css' extends keyof DialogRootProps ? true : false
>;
export type DialogRootStylePropsRemoved = ExpectFalse<
  'bg' extends keyof DialogRootProps ? true : false
>;
export type DialogContentObjectCssRemoved = ExpectFalse<
  'css' extends keyof DialogContentProps ? true : false
>;
export type DialogContentStylePropsRemoved = ExpectFalse<
  'bg' extends keyof DialogContentProps ? true : false
>;
export type DialogContentNativeHooksAccepted = ExpectTrue<
  Assignable<{ class: string; style: string }, DialogContentProps>
>;
export type MissingDialogValueRejected = ExpectFalse<
  Assignable<{ size: 'lg' }, DialogRootProviderProps>
>;
export type DialogActionObjectCssRemoved = ExpectFalse<
  'css' extends keyof DialogActionTriggerProps ? true : false
>;
export type DialogActionNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: string; class: string }, DialogActionTriggerProps>
>;
export type CommandDialogObjectCssRemoved = ExpectFalse<
  'css' extends keyof CommandDialogContentProps ? true : false
>;
export type CommandDialogStylePropsRemoved = ExpectFalse<
  'bg' extends keyof CommandDialogContentProps ? true : false
>;
export type CommandDialogNativeStyleAccepted = ExpectTrue<
  'style' extends keyof CommandDialogContentProps ? true : false
>;
type SelectedTrigger = Parameters<typeof DialogTrigger<'a'>>[0];
type SelectedHeader = Parameters<typeof DialogHeader<'form'>>[0];
type ChildRenderer = NonNullable<DialogTriggerProps['asChild']>;
export type SelectedTriggerRefAccepted = ExpectTrue<
  Assignable<{ as: 'a'; ref: (element: HTMLAnchorElement) => void }, SelectedTrigger>
>;
export type WrongTriggerRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedTrigger>
>;
export type WrongTriggerEventRejected = ExpectFalse<
  Assignable<
    { as: 'a'; onClick: (event: MouseEvent & { currentTarget: HTMLButtonElement }) => void },
    SelectedTrigger
  >
>;
export type WrongChildRefRejected = ExpectFalse<
  Assignable<
    { asChild: ChildRenderer; ref: (element: HTMLButtonElement) => void },
    DialogTriggerProps
  >
>;
export type WrongHeaderRefRejected = ExpectFalse<
  Assignable<{ as: 'form'; ref: (element: HTMLDivElement) => void }, SelectedHeader>
>;

/** Translate the owned Dialog event details into a Solid signal in an app. */
function updateOpen(details: DialogOpenChangeDetails): void {
  const open: boolean = details.open;
  void open;
}

/** Accept a ref for the native section rendered by DialogContent. */
function markContent(element: HTMLElement): void {
  element.dataset.consumerRef = 'true';
}

/** Accept the native paragraph ref exposed by DialogDescription. */
function markDescription(element: HTMLElement): void {
  element.dataset.consumerDescription = 'true';
}

/** Exercise a native trigger event from the installed package. */
function handleTriggerClick(event: MouseEvent & { currentTarget: HTMLButtonElement }): void {
  event.currentTarget.dataset.consumerClick = 'true';
}

/** Exercise a native content event from the installed package. */
function handleContentKeyDown(event: KeyboardEvent & { currentTarget: HTMLElement }): void {
  event.currentTarget.dataset.consumerKey = event.key;
}

export const dialog = (
  <DialogPropsProvider value={{ size: 'md', placement: 'center' }}>
    <DialogRoot defaultOpen={false} onOpenChange={updateOpen}>
      <DialogTrigger type="button" title="Open account settings" onClick={handleTriggerClick}>
        Open dialog
      </DialogTrigger>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent ref={markContent} tabindex={-1} onKeyDown={handleContentKeyDown}>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription ref={markDescription} lang="en">
              Change your account settings.
            </DialogDescription>
            <DialogCloseTrigger>Close dialog</DialogCloseTrigger>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  </DialogPropsProvider>
);

/** Typecheck the caller-owned machine, context, and layout parts after packing. */
export function DialogProviderConsumer(): JSX.Element {
  const machine = useDialog();

  /** Display a descendant reached through the primitive's Dialog context. */
  function renderContext(): JSX.Element {
    return <span>Dialog context</span>;
  }

  return (
    <DialogRootProvider value={machine} size="lg">
      <DialogContext>{renderContext}</DialogContext>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <DialogBody>Change your settings.</DialogBody>
      <DialogFooter>
        <DialogActionTrigger type="button">Save</DialogActionTrigger>
      </DialogFooter>
    </DialogRootProvider>
  );
}
