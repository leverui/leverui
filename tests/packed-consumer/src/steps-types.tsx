import { Steps, type StepsRootProps, type StepsRootProviderProps } from '@leverui/components';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
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

export type ProviderOrientationUsesMachine = ExpectFalse<
  'orientation' extends keyof StepsRootProviderProps ? true : false
>;
export type RootCssPropRejected = ExpectFalse<'css' extends keyof StepsRootProps ? true : false>;
export type RootRecipePropRejected = ExpectFalse<
  'recipe' extends keyof StepsRootProps ? true : false
>;
export type RootStyleShorthandRejected = ExpectFalse<
  'bg' extends keyof StepsRootProps ? true : false
>;
export type NativeClassAccepted = ExpectTrue<Assignable<{ class: 'steps' }, StepsRootProps>>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: '100%' } }, StepsRootProps>
>;
export type ResponsiveChoicesAccepted = ExpectTrue<
  Assignable<
    { size: { base: 'xs'; md: 'lg' }; variant: { base: 'solid'; md: 'subtle' } },
    StepsRootProps
  >
>;
export const steps = (
  <Steps.Root items={[{ value: 'install' }]} defaultValue="install" size="md" variant="solid">
    <Steps.List>
      <Steps.Item value="install" title="Install">
        <Steps.Trigger>
          <Steps.Indicator>
            <Steps.Number
              asChild={
                /** Preserve child composition in installed declarations. */
                (getProps) => <span {...getProps()} />
              }
            />
          </Steps.Indicator>
          <Steps.Title>Install</Steps.Title>
        </Steps.Trigger>
      </Steps.Item>
    </Steps.List>
    <Steps.Content value="install">Installed</Steps.Content>
  </Steps.Root>
);
