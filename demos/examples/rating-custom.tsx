import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { RatingGroup, Stack, Text, type RatingGroupIconProps } from '../../src';
import { colorPalettes, PlaygroundMatrix } from './playground-matrix';
import { RatingExampleControls } from './rating-shared';
import '../rating-group-examples.css';
import { Heart } from '@lucide/solid';

const emoji = ['😡', '😠', '😐', '😊', '😍'];
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** Show an expressive emoji at each rating value. */
export function RatingEmoji(): JSX.Element {
  return (
    <RatingGroup.Root count={5} defaultValue={3}>
      <RatingGroup.Control>
        <For each={emoji}>
          {
            /** Tie each visible emoji to its one-based rating index. */
            (face, index) => (
              <RatingGroup.Item index={index() + 1} class="rating-example-emoji">
                {face}
              </RatingGroup.Item>
            )
          }
        </For>
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
}

/** Render the Ionicons heart for both rating layers. */
function HeartIcon(props: Omit<RatingGroupIconProps, 'style' | 'color'>): JSX.Element {
  return <Heart {...props} />;
}

/** Replace the five default stars with red hearts. */
export function RatingCustomIcon(): JSX.Element {
  return (
    <RatingGroup.Root count={5} defaultValue={4} colorPalette="red">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control>
        <For each={[1, 2, 3, 4, 5]}>
          {
            /** Give each heart its own machine rating index. */
            (index) => (
              <RatingGroup.Item index={index}>
                <RatingGroup.ItemIndicator icon={HeartIcon} />
              </RatingGroup.Item>
            )
          }
        </For>
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
}

/** Show a three-star value in each color palette. */
export function RatingColors(): JSX.Element {
  return (
    <Stack gap="2" align="flex-start">
      <For each={colorPalettes}>
        {
          /** Pair one palette label with its interactive rating. */
          (colorPalette) => (
            <Stack
              align="center"
              direction="row"
              gap="10"
              style={{ 'padding-inline': 'var(--leverui-spacing-4)' }}
            >
              <Text style={{ 'min-width': '8ch' }}>{colorPalette}</Text>
              <RatingGroup.Root count={5} defaultValue={3} size="sm" colorPalette={colorPalette}>
                <RatingGroup.HiddenInput />
                <RatingGroup.Control />
              </RatingGroup.Root>
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the four rating sizes. */
export function RatingSizes(): JSX.Element {
  return (
    <Stack>
      <For each={sizes}>
        {
          /** Render one rating at the current size. */
          (size) => (
            <RatingGroup.Root count={5} defaultValue={3} size={size}>
              <RatingGroup.HiddenInput />
              <RatingGroup.Control />
            </RatingGroup.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Cross four sizes with every color palette. */
export function RatingSizeMatrix(): JSX.Element {
  return (
    <PlaygroundMatrix
      values={sizes}
      renderCell={
        /** Render one half-star rating in the current matrix cell. */
        (size, colorPalette) => (
          <RatingGroup.Root allowHalf defaultValue={3.5} colorPalette={colorPalette} size={size}>
            <RatingExampleControls />
          </RatingGroup.Root>
        )
      }
    />
  );
}
