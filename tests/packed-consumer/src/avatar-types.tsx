import {
  Avatar,
  AvatarGroup,
  type AvatarFallbackProps,
  type AvatarGroupProps,
  type AvatarRootProps,
  type AvatarStatusChangeDetails,
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

export type AvatarSizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, AvatarRootProps>>;
export type InvalidAvatarSizeRejected = ExpectFalse<
  Assignable<{ size: 'oversized' }, AvatarRootProps>
>;
export type AvatarCssObjectRejected = ExpectFalse<
  'css' extends keyof AvatarRootProps ? true : false
>;
export type AvatarRecipeRejected = ExpectFalse<
  'recipe' extends keyof AvatarRootProps ? true : false
>;
export type AvatarNativeStyleAccepted = ExpectTrue<
  'style' extends keyof AvatarRootProps ? true : false
>;
export type FallbackNameAccepted = ExpectTrue<Assignable<{ name: string }, AvatarFallbackProps>>;
export type ExplicitUndefinedNameAccepted = ExpectTrue<
  Assignable<{ name: string | undefined }, AvatarFallbackProps>
>;
export type NativeGroupSectionAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, AvatarGroupProps<'section'>>
>;
export type DefaultGroupSectionAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, AvatarGroupProps>
>;
export type WrongGroupSectionRefRejected = ExpectFalse<
  Assignable<
    { as: 'section'; ref: (element: HTMLButtonElement) => void },
    AvatarGroupProps<'section'>
  >
>;

/** Receive the selected native AvatarGroup section through the public ref. */
function receiveSection(element: HTMLElement): void {
  element.dataset.avatarGroupRef = 'section';
}

/** Receive the installed primitive status change through the public type. */
function receiveStatus(details: AvatarStatusChangeDetails): void {
  const status: string = details.status;
  void status;
}

/** Confirm the installed compound surface and callback compile together. */
export function typedAvatar(): JSX.Element {
  return (
    <AvatarGroup as="section" ref={receiveSection} borderless={{ base: true, md: false }}>
      <Avatar.Root onStatusChange={receiveStatus}>
        <Avatar.Image src="/profile.png" alt="Profile" />
        <Avatar.Fallback name={undefined} />
      </Avatar.Root>
    </AvatarGroup>
  );
}
