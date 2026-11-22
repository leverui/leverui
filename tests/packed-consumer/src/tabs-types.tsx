import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPropsProvider,
  TabsRoot,
  TabsTrigger,
  type TabsRootBaseProps,
  type TabsRootProps,
  type TabsValueChangeDetails,
} from '@leverui/components';

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

export type ControlledValueAccepted = ExpectTrue<Assignable<{ value: 'one' }, TabsRootProps>>;
export type InvalidOrientationRejected = ExpectFalse<
  Assignable<{ orientation: 'diagonal' }, TabsRootProps>
>;
export type InvalidVariantRejected = ExpectFalse<Assignable<{ variant: 'glow' }, TabsRootProps>>;
export type TabsObjectCssRemoved = ExpectFalse<'css' extends keyof TabsRootProps ? true : false>;
export type TabsRecipeRemoved = ExpectFalse<'recipe' extends keyof TabsRootProps ? true : false>;
export type TabsStylePropRemoved = ExpectFalse<'bg' extends keyof TabsRootProps ? true : false>;
export type ProviderChildRendererAccepted = ExpectTrue<
  'asChild' extends keyof TabsRootBaseProps ? true : false
>;

/** Store selected value through the package-owned event contract. */
function updateValue(details: TabsValueChangeDetails): void {
  const value: string | null = details.value;
  void value;
}

/** Observe the real native trigger element delivered by the primitive. */
function markTrigger(element: HTMLButtonElement): void {
  element.dataset.consumerTrigger = 'true';
}

export const tabs = (
  <TabsPropsProvider value={{ size: 'sm', variant: 'line' }}>
    <TabsRoot defaultValue="one" onValueChange={updateValue} aria-label="Installed tabs">
      <TabsList aria-label="Account sections">
        <TabsTrigger value="one" ref={markTrigger} type="button">
          One
        </TabsTrigger>
        <TabsTrigger value="two" disabled>
          Two
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="one" tabindex={0}>
        First panel
      </TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
    </TabsRoot>
  </TabsPropsProvider>
);
