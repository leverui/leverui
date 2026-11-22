import { type JSX } from '@solidjs/web';
import { RadioGroup } from '../src';

export type RadioGroupFamilyChoiceProps = {
  readonly value: string;
  readonly label: string;
};

/** Give each guide choice one native radio input and a visible mark. */
export function RadioGroupFamilyChoice(props: RadioGroupFamilyChoiceProps): JSX.Element {
  return (
    <RadioGroup.Item value={props.value}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemIndicator />
      <RadioGroup.ItemText>{props.label}</RadioGroup.ItemText>
    </RadioGroup.Item>
  );
}
