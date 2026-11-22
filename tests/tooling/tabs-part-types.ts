import type { renderTabsPart } from '../../src/components/tabs-part';

type Assignable<From, To> = [From] extends [To] ? true : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type TriggerProps = Parameters<typeof renderTabsPart<'trigger'>>[1];
type ContentProps = Parameters<typeof renderTabsPart<'content'>>[1];

export type TriggerAcceptsValue = ExpectTrue<Assignable<{ value: 'one' }, TriggerProps>>;
export type TriggerRequiresValue = ExpectFalse<Assignable<Record<string, never>, TriggerProps>>;
export type ContentAcceptsValue = ExpectTrue<Assignable<{ value: 'one' }, ContentProps>>;
export type ContentRequiresValue = ExpectFalse<Assignable<Record<string, never>, ContentProps>>;
