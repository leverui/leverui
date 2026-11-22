import {
  HoverCard,
  HoverCardContent,
  HoverCardRoot,
  HoverCardRootProvider,
  HoverCardTrigger,
  type HoverCardContentProps,
  type HoverCardOpenChangeDetails,
  type HoverCardRootProps,
  type HoverCardRootProviderProps,
  type UseHoverCardReturn,
  useHoverCard,
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
  Assignable<{ open: true; openDelay: number; closeDelay: number }, HoverCardRootProps>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, HoverCardRootProps>
>;
export type NativeContentStyleAccepted = ExpectTrue<
  Assignable<{ class: string; style: { color: string } }, HoverCardContentProps>
>;
export type ContentCssObjectRejected = ExpectFalse<
  'css' extends keyof HoverCardContentProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<Assignable<{ recipe: object }, HoverCardRootProps>>;
export type ProviderRequiresMachine = ExpectFalse<
  Assignable<{ lazyMount: true }, HoverCardRootProviderProps>
>;
export type ProviderAcceptsMachine = ExpectTrue<
  Assignable<{ value: UseHoverCardReturn; lazyMount: true }, HoverCardRootProviderProps>
>;
type SelectedAnchor = Parameters<typeof HoverCardTrigger<'a'>>[0];
export type AnchorRefAccepted = ExpectTrue<
  Assignable<{ as: 'a'; ref: (element: HTMLAnchorElement) => void }, SelectedAnchor>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SelectedAnchor>
>;
type SelectedArticle = Parameters<typeof HoverCardContent<'article'>>[0];
type DefaultContent = Parameters<typeof HoverCardContent<'div'>>[0];
export type DefaultContentRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLDivElement) => void }, DefaultContent>
>;
export type WrongContentRefRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLButtonElement) => void }, DefaultContent>
>;
export type ArticleRefAccepted = ExpectTrue<
  Assignable<{ as: 'article'; ref: (element: HTMLElement) => void }, SelectedArticle>
>;

/** Exercise the installed controlled-open callback contract. */
function updateOpen(details: HoverCardOpenChangeDetails): void {
  const open: boolean = details.open;
  void open;
}

/** Receive the selected native anchor from the public trigger. */
function captureAnchor(element: HTMLAnchorElement): void {
  void element;
}

/** Exercise owned and caller-owned modes through the installed entry point. */
export function HoverCardConsumer(): JSX.Element {
  const card = useHoverCard({ defaultOpen: false });
  return (
    <>
      <HoverCardRoot size="sm" onOpenChange={updateOpen}>
        <HoverCardTrigger as="a" href="#member" ref={captureAnchor}>
          Preview member
        </HoverCardTrigger>
        <HoverCardContent class="profile-preview" style={{ color: 'white' }}>
          Member preview
        </HoverCardContent>
      </HoverCardRoot>
      <HoverCardRootProvider value={card} lazyMount>
        <HoverCard.Trigger value="member">Preview another member</HoverCard.Trigger>
        <HoverCard.Content>
          <HoverCard.Arrow />
          Another preview
        </HoverCard.Content>
      </HoverCardRootProvider>
    </>
  );
}
