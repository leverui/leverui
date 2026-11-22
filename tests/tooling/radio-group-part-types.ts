import type {
  RadioGroupItemControlProps,
  RadioGroupItemProps,
  RadioGroupLabelProps,
} from '../../src/components/radio-group-part-props';

type Assignable<From, To> = [From] extends [To] ? true : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
export type RadioItemAcceptsValue = ExpectTrue<Assignable<{ value: 'solid' }, RadioGroupItemProps>>;
export type RadioItemRequiresValue = ExpectFalse<
  Assignable<Record<string, never>, RadioGroupItemProps>
>;
export type RadioLabelAcceptsNativeProps = ExpectTrue<
  Assignable<{ title: 'Framework' }, RadioGroupLabelProps>
>;
export type RadioControlAcceptsChild = ExpectTrue<
  Assignable<{ 'data-state': 'checked' }, RadioGroupItemControlProps>
>;
