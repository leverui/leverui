import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxPropsProvider,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
  type CheckboxCheckedChangeDetails,
  type CheckboxControlProps,
  type CheckboxIndicatorProps,
  type CheckboxLabelProps,
  type CheckboxRootProps,
} from '@leverui/components';
import { Dynamic, type JSX } from '@solidjs/web';

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

export type MixedCheckedStateAccepted = ExpectTrue<
  Assignable<{ checked: 'indeterminate' }, CheckboxRootProps>
>;
export type InvalidCheckboxSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, CheckboxRootProps>
>;
export type RootAsSupported = ExpectTrue<'as' extends keyof CheckboxRootProps ? true : false>;
export type RootCssRejected = ExpectFalse<'css' extends keyof CheckboxRootProps ? true : false>;
export type ControlCssRejected = ExpectFalse<
  'css' extends keyof CheckboxControlProps ? true : false
>;
export type LabelCssRejected = ExpectFalse<'css' extends keyof CheckboxLabelProps ? true : false>;
export type ControlAsChildAccepted = ExpectTrue<
  Assignable<{ asChild: NonNullable<CheckboxControlProps['asChild']> }, CheckboxControlProps>
>;
export type IndicatorCssRejected = ExpectFalse<
  'css' extends keyof CheckboxIndicatorProps ? true : false
>;
export type IndicatorNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { stroke: string } }, CheckboxIndicatorProps>
>;

/** Accept the primitive's checked-change details in a packed Solid consumer. */
function updateChecked(details: CheckboxCheckedChangeDetails): void {
  const state: boolean | 'indeterminate' = details.checked;
  void state;
}

/** Accept an HTMLElement ref for a custom native Control or Label child. */
function markChild(element: HTMLElement): void {
  element.dataset.consumerRef = 'true';
}

export const checkbox = (
  <CheckboxPropsProvider value={{ size: 'lg', variant: 'outline' }}>
    <CheckboxRoot checked="indeterminate" onCheckedChange={updateChecked} name="consent">
      <CheckboxControl>
        <CheckboxIndicator
          checked={
            /** Apply the indicator contract to the consumer's SVG. */
            (getProps) => (
              <Dynamic component="svg" {...getProps()}>
                <Dynamic component="path" d="M5 12h14" />
              </Dynamic>
            )
          }
        />
      </CheckboxControl>
      <CheckboxLabel>Consent</CheckboxLabel>
      <CheckboxHiddenInput />
    </CheckboxRoot>
  </CheckboxPropsProvider>
);

export const composedCheckbox = (
  <CheckboxRoot defaultChecked>
    <CheckboxControl
      ref={markChild}
      asChild={
        /** Preserve the primitive control state on an app-owned element. */
        (getProps) => <div {...getProps()} />
      }
    />
    <CheckboxLabel
      ref={markChild}
      asChild={
        /** Preserve the native label relationship on an app-owned span. */
        (getProps) => <span {...getProps()}>Consent</span>
      }
    />
    <CheckboxHiddenInput />
  </CheckboxRoot>
);

/** Check that published declarations support a caller-owned Solid machine. */
export function StoredCheckbox(): JSX.Element {
  const machine = useCheckbox({ defaultChecked: true });
  return (
    <CheckboxRootProvider value={machine}>
      <CheckboxControl />
      <CheckboxLabel>Stored</CheckboxLabel>
      <CheckboxHiddenInput />
    </CheckboxRootProvider>
  );
}

/** Check native CSS classes and style on a packed consumer part. */
export function StyledCheckboxLabel(): JSX.Element {
  return (
    <CheckboxLabel class="consumer-checkbox-label" style={{ 'font-weight': '700' }}>
      Styled
    </CheckboxLabel>
  );
}

export const groupedCheckbox = (
  <CheckboxGroup name="topics" defaultValue={['solid']} maxSelectedValues={1}>
    <CheckboxRoot as="section" value="solid">
      <CheckboxControl />
      <CheckboxLabel>Solid</CheckboxLabel>
      <CheckboxHiddenInput />
    </CheckboxRoot>
  </CheckboxGroup>
);
