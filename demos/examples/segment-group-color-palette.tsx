import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Center, SegmentGroup } from '../../src';
import './segment-group-color-palette.css';

/** Apply the orange palette to two choices. */
export function SegmentGroupColorPalette(): JSX.Element {
  return (
    <Center style={{ 'min-height': '100dvh' }}>
      <SegmentGroup.Root class="segment-group-orange" defaultValue="Monthly">
        <SegmentGroup.Indicator />
        <For each={['Monthly', 'Yearly']}>
          {
            /** Render a custom text style for each selectable interval. */
            (item) => (
              <SegmentGroup.Item value={item}>
                <SegmentGroup.ItemText class="segment-group-orange-text">
                  {item}
                </SegmentGroup.ItemText>
                <SegmentGroup.ItemHiddenInput />
              </SegmentGroup.Item>
            )
          }
        </For>
      </SegmentGroup.Root>
    </Center>
  );
}
