import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuRootProvider,
  MenuTrigger,
  type MenuRootProps,
  type MenuRootProviderProps,
  type UseMenuReturn,
  useMenu,
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
  Assignable<{ open: true; positioning: { placement: 'bottom-start' } }, MenuRootProps>
>;
export type FiniteAppearanceAccepted = ExpectTrue<
  Assignable<{ size: 'sm'; variant: 'solid' }, MenuRootProps>
>;
export type RootRecipeRejected = ExpectFalse<'recipe' extends keyof MenuRootProps ? true : false>;
export type ItemCssRejected = ExpectFalse<
  'css' extends keyof Parameters<typeof MenuItem>[0] ? true : false
>;
export type ContentStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: '240px' } }, Parameters<typeof MenuContent>[0]>
>;
export type ContentSpacingPropRejected = ExpectFalse<
  'p' extends keyof Parameters<typeof MenuContent>[0] ? true : false
>;
export type ProviderRequiresMachine = ExpectFalse<
  Assignable<{ lazyMount: true }, MenuRootProviderProps>
>;
export type ProviderAcceptsMachine = ExpectTrue<
  Assignable<{ value: UseMenuReturn; lazyMount: true }, MenuRootProviderProps>
>;
export type ItemRequiresValue = ExpectFalse<
  Assignable<{ children: 'Open' }, Parameters<typeof MenuItem>[0]>
>;
export type ItemAcceptsValue = ExpectTrue<
  Assignable<{ value: 'open' }, Parameters<typeof MenuItem>[0]>
>;
type SelectedAnchor = Parameters<typeof MenuTrigger<'a'>>[0];
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

/** Exercise owned and caller-owned menu modes through the installed entry. */
export function MenuConsumer(): JSX.Element {
  const menu = useMenu({ defaultOpen: false });
  return (
    <>
      <MenuRoot size="sm" variant="solid">
        <MenuTrigger as="a" href="#actions" ref={captureAnchor}>
          Actions
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="open">Open</MenuItem>
        </MenuContent>
      </MenuRoot>
      <MenuRootProvider value={menu} lazyMount>
        <Menu.Trigger>More</Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="save">Save</Menu.Item>
        </Menu.Content>
      </MenuRootProvider>
    </>
  );
}
