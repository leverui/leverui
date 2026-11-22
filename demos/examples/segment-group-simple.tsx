import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SegmentGroup, Stack, Text, VStack } from '../../src';
import './segment-group-indicator.css';

const frameworks = ['React', 'Vue', 'Solid'];
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Show the three framework options. */
export function SegmentGroupBasic(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="React">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={frameworks} />
    </SegmentGroup.Root>
  );
}

/** Bind selection to a Solid signal. */
export function SegmentGroupControlled(): JSX.Element {
  const [value, setValue] = createSignal<string | null>('React');

  /** Store the value returned by the segment machine. */
  function updateValue(details: { value: string | null }): void {
    setValue(details.value);
  }

  return (
    <SegmentGroup.Root value={value()} onValueChange={updateValue}>
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={frameworks} />
    </SegmentGroup.Root>
  );
}

/** Stack options in the vertical orientation. */
export function SegmentGroupVertical(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="React" orientation="vertical">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={frameworks} />
    </SegmentGroup.Root>
  );
}

/** Disable the whole segment set. */
export function SegmentGroupDisabled(): JSX.Element {
  return (
    <SegmentGroup.Root disabled defaultValue="React">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={frameworks} />
    </SegmentGroup.Root>
  );
}

/** Disable only Vue while keeping the other choices active. */
export function SegmentGroupDisabledItem(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="React">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items
        items={[
          { label: 'React', value: 'React' },
          { label: 'Vue', value: 'Vue', disabled: true },
          { label: 'Solid', value: 'Solid' },
        ]}
      />
    </SegmentGroup.Root>
  );
}

/** Customize the selected segment's color and shadow. */
export function SegmentGroupCustomIndicator(): JSX.Element {
  return (
    <SegmentGroup.Root defaultValue="react" class="example-segment-group-teal-indicator">
      <SegmentGroup.Indicator />
      <SegmentGroup.Items
        items={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'solid', label: 'Solid' },
        ]}
      />
    </SegmentGroup.Root>
  );
}

/** Show the four size variants. */
export function SegmentGroupSizes(): JSX.Element {
  return (
    <Stack gap="5" align="flex-start">
      <For each={sizes}>
        {
          /** Pair each segment size with its visible label. */
          (size) => (
            <VStack align="flex-start">
              <SegmentGroup.Root size={size} defaultValue="React">
                <SegmentGroup.Indicator />
                <SegmentGroup.Items items={frameworks} />
              </SegmentGroup.Root>
              <Text>size = {size}</Text>
            </VStack>
          )
        }
      </For>
    </Stack>
  );
}
