import { type JSX } from '@solidjs/web';
import type { RadioGroup as RadioGroupExport } from '../src';

export type RadioGroupHydrationComponents = {
  RadioGroup: typeof RadioGroupExport;
};

const items = [
  { label: 'Solid', value: 'solid' },
  { label: 'React', value: 'react' },
];

/** Render matching labeled radios under either root mode. */
function HydratedParts(props: { RadioGroup: typeof RadioGroupExport; name: string }): JSX.Element {
  const RadioGroup = props.RadioGroup;
  return (
    <>
      <RadioGroup.Label>{props.name}</RadioGroup.Label>
      {items.map(
        /** Preserve item order and value IDs across server and client. */
        (item) => (
          <RadioGroup.Item value={item.value} data-testid={`${props.name}-${item.value}`}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator data-testid={`${props.name}-${item.value}-indicator`} />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ),
      )}
    </>
  );
}

/** Build matching machine-owned and external Radio Group trees. */
export function renderRadioGroupHydrationTree({
  RadioGroup,
}: RadioGroupHydrationComponents): JSX.Element {
  const external = RadioGroup.useRadioGroup({
    id: 'hydrated-radio-group-external',
    name: 'external-framework',
    defaultValue: 'react',
  });
  return (
    <>
      <RadioGroup.Root
        id="hydrated-radio-group-primary"
        name="primary-framework"
        defaultValue="solid"
      >
        <HydratedParts RadioGroup={RadioGroup} name="Hydrated primary" />
      </RadioGroup.Root>
      <RadioGroup.RootProvider value={external}>
        <HydratedParts RadioGroup={RadioGroup} name="Hydrated external" />
      </RadioGroup.RootProvider>
    </>
  );
}
