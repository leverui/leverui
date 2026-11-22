import {
  HStack,
  QrCode,
  RadioCard,
  RadioGroup,
  Radiomark,
  RatingGroup,
  ScrollArea,
  SegmentGroup,
  Select,
  Stack,
  Text,
} from '../../../../src';
import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

const guests = ['Mara Ellison', 'Theo Park', 'Iris Calder', 'Jonah Reyes', 'Nora Whitlock'];
const sizes = Select.createListCollection({ items: ['Small', 'Medium'] });

/** A small code for a web address. */
function QrCodeDemo(): JSX.Element {
  return (
    <QrCode.Root value="https://leverui.com" size="sm">
      <QrCode.Frame />
    </QrCode.Root>
  );
}

/** Two cards, the first one selected. */
function RadioCardDemo(): JSX.Element {
  return (
    <RadioCard.Root defaultValue="Monthly" size="sm" style={{ width: '100%' }}>
      <HStack gap="2" align="stretch">
        <For each={['Monthly', 'Yearly']}>
          {/** Show one plan as a card. */}
          {(plan) => (
            <RadioCard.Item value={plan}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemText>{plan}</RadioCard.ItemText>
                <RadioCard.ItemIndicator />
              </RadioCard.ItemControl>
            </RadioCard.Item>
          )}
        </For>
      </HStack>
    </RadioCard.Root>
  );
}

/** Two options, the first one selected. */
function RadioDemo(): JSX.Element {
  return (
    <RadioGroup.Root defaultValue="standard" size="sm">
      <Stack gap="2">
        <RadioGroup.Item value="standard">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator />
          <RadioGroup.ItemText>Standard delivery</RadioGroup.ItemText>
        </RadioGroup.Item>
        <RadioGroup.Item value="express">
          <RadioGroup.ItemHiddenInput />
          <RadioGroup.ItemIndicator />
          <RadioGroup.ItemText>Express delivery</RadioGroup.ItemText>
        </RadioGroup.Item>
      </Stack>
    </RadioGroup.Root>
  );
}

/** A selected mark and an empty mark. */
function RadiomarkDemo(): JSX.Element {
  return (
    <HStack gap="3">
      <Radiomark checked />
      <Radiomark />
    </HStack>
  );
}

/** Three stars out of five. */
function RatingDemo(): JSX.Element {
  return (
    <RatingGroup.Root count={5} defaultValue={3}>
      <RatingGroup.Control />
    </RatingGroup.Root>
  );
}

/** A short box with a list that scrolls. */
function ScrollAreaDemo(): JSX.Element {
  return (
    <ScrollArea.Root variant="always" size="sm" style={{ width: '100%', height: '96px' }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <For each={guests}>
            {/** Show one name in the list. */}
            {(guest) => <Text>{guest}</Text>}
          </For>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

/** Three choices, the middle one selected. */
function SegmentedControlDemo(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="Week" size="sm" aria-label="Range">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={['Day', 'Week', 'Month']} />
    </SegmentGroup.Root>
  );
}

/** A select field above a picture of its open list. */
function SelectDemo(): JSX.Element {
  return (
    <Stack gap="1" style={{ width: '180px' }}>
      <Select.Root collection={sizes} defaultValue={['Medium']} size="xs">
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Size" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
      </Select.Root>
      <PopupSurface>
        <Text>Small</Text>
        <HStack gap="2" justify="space-between">
          <Text>Medium</Text>
          <i class="bi bi-check-lg" aria-hidden="true" />
        </HStack>
      </PopupSurface>
    </Stack>
  );
}

/** The overview demos for qr-code through select, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'qr-code': QrCodeDemo,
  'radio-card': RadioCardDemo,
  radio: RadioDemo,
  radiomark: RadiomarkDemo,
  rating: RatingDemo,
  'scroll-area': ScrollAreaDemo,
  'segmented-control': SegmentedControlDemo,
  select: SelectDemo,
};
