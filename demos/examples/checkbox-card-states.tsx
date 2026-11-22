import { type JSX } from '@solidjs/web';
import { CheckboxCard, Stack, type CheckboxCardRootProps } from '../../src';
import './checkbox-card-layout.css';

/** Show the disabled state with its copy. */
export function CheckboxCardDisabled(): JSX.Element {
  return (
    <CheckboxCard.Root disabled class="example-checkbox-card-stack">
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Disabled</CheckboxCard.Label>
          <CheckboxCard.Description>You cannot select this card</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}

/** Compare unchecked, checked, disabled, and invalid cards. */
export function CheckboxCardWithStates(): JSX.Element {
  return (
    <Stack>
      <DemoCheckboxCard />
      <DemoCheckboxCard defaultChecked />
      <DemoCheckboxCard disabled />
      <DemoCheckboxCard defaultChecked disabled />
      <DemoCheckboxCard invalid />
    </Stack>
  );
}

/** Render the title, description, and indicator for one state card. */
function DemoCheckboxCard(props: CheckboxCardRootProps): JSX.Element {
  return (
    <CheckboxCard.Root class="example-checkbox-card-sample" {...props}>
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Next.js</CheckboxCard.Label>
          <CheckboxCard.Description>For full-stack apps</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}
