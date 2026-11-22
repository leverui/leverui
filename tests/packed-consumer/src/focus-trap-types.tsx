import { FocusTrap, type FocusTrapProps } from '@leverui/components';
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

export type CssObjectRejected = ExpectFalse<'css' extends keyof FocusTrapProps ? true : false>;

export type FocusOptionsAccepted = ExpectTrue<
  Assignable<
    {
      disabled: true;
      returnFocusOnDeactivate: false;
      persistentElements: Array<() => Element | null>;
    },
    FocusTrapProps
  >
>;

type SelectedSection = Parameters<typeof FocusTrap<'section'>>[0];
export type SectionRefAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, SelectedSection>
>;
export type WrongSectionRefRejected = ExpectFalse<
  Assignable<{ as: 'section'; ref: (element: HTMLButtonElement) => void }, SelectedSection>
>;

type ChildGetter = Parameters<NonNullable<FocusTrapProps['asChild']>>[0];
type ChildOverrides = NonNullable<Parameters<ChildGetter>[0]>;
export type ValueChildRefRejected = ExpectFalse<
  Assignable<{ ref: HTMLDivElement }, ChildOverrides>
>;

/** Capture the precise selected HTML element from the installed package. */
function captureSection(element: HTMLElement): void {
  void element;
}

/** Exercise the native child's supported functional ref contract. */
function captureChild(element: HTMLElement): void {
  void element;
}

/** Resolve the consumer's initial focus target. */
function initialFocus(): HTMLElement {
  return document.body;
}

/** Exercise native, selected, and child-rendered public component paths. */
export function FocusTrapConsumer(): JSX.Element {
  return (
    <>
      <FocusTrap disabled style={{ padding: '4px' }}>
        Native trap
      </FocusTrap>
      <FocusTrap as="section" disabled ref={captureSection} initialFocus={initialFocus}>
        Selected trap
      </FocusTrap>
      <FocusTrap
        disabled
        asChild={
          /** Forward trap attributes and the composed ref to a caller-owned article. */
          (getProps) => <article {...getProps({ ref: captureChild })}>Child trap</article>
        }
      />
    </>
  );
}
