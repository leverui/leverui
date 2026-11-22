import { type JSX } from '@solidjs/web';
import type { RadioCard as RadioCardExport } from '../dist/index.js';

export type RadioCardHydrationComponents = {
  RadioCard: typeof RadioCardExport;
};

const items = [
  { label: 'Solid', value: 'solid' },
  { label: 'React', value: 'react' },
];

/** Render the selected custom icon through the published callback API. */
function HydratedIndicator(props: {
  RadioCard: typeof RadioCardExport;
  name: string;
  value: string;
}): JSX.Element {
  const RadioCard = props.RadioCard;
  if (props.value !== 'solid') return <RadioCard.ItemIndicator />;
  return (
    <RadioCard.ItemIndicator
      checked={
        /** Keep the SVG as the indicator root in server and browser trees. */
        (getProps) => (
          <svg
            {...getProps()}
            data-testid={`${props.name}-${props.value}-custom-indicator`}
            viewBox="0 0 24 24"
          >
            <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" />
          </svg>
        )
      }
    />
  );
}

/** Render matching labeled radio inputs under either root mode. */
function HydratedParts(props: { RadioCard: typeof RadioCardExport; name: string }): JSX.Element {
  const RadioCard = props.RadioCard;
  return (
    <>
      <RadioCard.Label>{props.name}</RadioCard.Label>
      {items.map(
        /** Preserve item order and value IDs across server and client. */
        (item) => (
          <RadioCard.Item value={item.value} data-testid={`${props.name}-${item.value}`}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>{item.label}</RadioCard.ItemText>
              <HydratedIndicator RadioCard={RadioCard} name={props.name} value={item.value} />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ),
      )}
    </>
  );
}

/** Build matching machine-owned and external Radio Card trees. */
export function renderRadioCardHydrationTree({
  RadioCard,
}: RadioCardHydrationComponents): JSX.Element {
  const external = RadioCard.useRadioCardGroup({
    id: 'hydrated-radio-card-external',
    name: 'external-framework',
    defaultValue: 'react',
  });
  return (
    <>
      <RadioCard.Root
        id="hydrated-radio-card-primary"
        name="primary-framework"
        defaultValue="solid"
      >
        <HydratedParts RadioCard={RadioCard} name="Hydrated primary" />
      </RadioCard.Root>
      <RadioCard.RootProvider value={external}>
        <HydratedParts RadioCard={RadioCard} name="Hydrated external" />
      </RadioCard.RootProvider>
    </>
  );
}
