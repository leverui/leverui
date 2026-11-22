import {
  Drawer,
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerContext,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerRootProvider,
  DrawerRootPropsProvider,
  DrawerTitle,
  DrawerTrigger,
  Portal,
  type DrawerOpenChangeDetails,
  type DrawerBodyProps,
  type DrawerActionTriggerProps,
  type DrawerBackdropProps,
  type DrawerCloseTriggerProps,
  type DrawerContentProps,
  type DrawerDescriptionProps,
  type DrawerFooterProps,
  type DrawerHeaderProps,
  type DrawerPositionerProps,
  type DrawerRootProps,
  type DrawerRootProviderProps,
  type DrawerTitleProps,
  type DrawerTriggerProps,
  type UseDrawerReturn,
  useDrawer,
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

export type DrawerVariantsAccepted = ExpectTrue<
  Assignable<{ size: 'xs'; placement: 'start'; contained: true }, DrawerRootProps>
>;
export type DrawerPresenceOptionAccepted = ExpectTrue<
  Assignable<{ skipAnimationOnMount: true }, DrawerRootProps>
>;
export type DrawerProviderPresenceOptionAccepted = ExpectTrue<
  Assignable<{ value: UseDrawerReturn; skipAnimationOnMount: true }, DrawerRootProviderProps>
>;
export type InvalidDrawerSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, DrawerRootProps>>;
export type InvalidDrawerPlacementRejected = ExpectFalse<
  Assignable<{ placement: 'center' }, DrawerRootProps>
>;
export type DrawerResponsiveChoicesAccepted = ExpectTrue<
  Assignable<
    {
      size: readonly ['sm', null, 'lg'];
      placement: { lgDown: 'start' };
      contained: { mdDown: true };
    },
    DrawerRootProps
  >
>;
export type DrawerRecipePropRemoved = ExpectFalse<
  'recipe' extends keyof DrawerRootProps ? true : false
>;
export type MissingDrawerMachineRejected = ExpectFalse<
  Assignable<{ size: 'lg' }, DrawerRootProviderProps>
>;
type SelectedTrigger = Parameters<typeof DrawerTrigger<'a'>>[0];
export type WrongDrawerTriggerRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedTrigger>
>;
export type DrawerContentCssRemoved = ExpectFalse<
  'css' extends keyof DrawerContentProps ? true : false
>;
export type DrawerBodyPaddingRemoved = ExpectFalse<
  'padding' extends keyof DrawerBodyProps ? true : false
>;
export type DrawerActionCssRemoved = ExpectFalse<
  'css' extends keyof DrawerActionTriggerProps ? true : false
>;
export type DrawerActionNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: string; class: string }, DrawerActionTriggerProps>
>;
type ExposesObjectCss<Props> = 'css' extends keyof Props ? true : false;
export type DrawerRootObjectCssRemoved = ExpectFalse<
  ExposesObjectCss<DrawerRootProps> | ExposesObjectCss<DrawerRootProviderProps>
>;
type AnyDrawerPartExposesObjectCss =
  | ExposesObjectCss<DrawerTriggerProps>
  | ExposesObjectCss<DrawerBackdropProps>
  | ExposesObjectCss<DrawerPositionerProps>
  | ExposesObjectCss<DrawerContentProps>
  | ExposesObjectCss<DrawerTitleProps>
  | ExposesObjectCss<DrawerDescriptionProps>
  | ExposesObjectCss<DrawerCloseTriggerProps>
  | ExposesObjectCss<DrawerHeaderProps>
  | ExposesObjectCss<DrawerBodyProps>
  | ExposesObjectCss<DrawerFooterProps>
  | ExposesObjectCss<DrawerActionTriggerProps>;
export type DrawerPartObjectCssRemoved = ExpectFalse<AnyDrawerPartExposesObjectCss>;
export type DrawerNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: string; class: string }, DrawerContentProps>
>;

/** Translate installed Drawer open events into application state. */
function updateOpen(details: DrawerOpenChangeDetails): void {
  const open: boolean = details.open;
  void open;
}

export const drawer = (
  <DrawerRootPropsProvider value={{ size: 'sm', placement: 'end' }}>
    <DrawerRoot defaultOpen={false} onOpenChange={updateOpen}>
      <DrawerTrigger type="button">Open installed Drawer</DrawerTrigger>
      <Portal>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent tabindex={-1}>
            <DrawerHeader>
              <DrawerTitle>Installed Drawer</DrawerTitle>
              <DrawerDescription>Accessible Drawer content</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>Installed Drawer body</DrawerBody>
            <DrawerFooter>
              <DrawerActionTrigger type="button">Save</DrawerActionTrigger>
              <DrawerCloseTrigger>Cancel</DrawerCloseTrigger>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    </DrawerRoot>
  </DrawerRootPropsProvider>
);

/** Check the namespace and externally owned machine after installation. */
export function DrawerProviderConsumer(): JSX.Element {
  const machine = useDrawer();

  /** Render a child using the public Drawer context. */
  function renderContext(): JSX.Element {
    return <span>Drawer context</span>;
  }

  return (
    <DrawerRootProvider value={machine} size="lg">
      <Drawer.Context>{renderContext}</Drawer.Context>
      <DrawerContext>{renderContext}</DrawerContext>
      <Drawer.Header>
        <Drawer.Title>Provider Drawer</Drawer.Title>
      </Drawer.Header>
    </DrawerRootProvider>
  );
}
