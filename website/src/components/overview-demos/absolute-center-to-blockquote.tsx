import {
  AbsoluteCenter,
  AspectRatio,
  Bleed,
  Blockquote,
  Box,
  Button,
  HStack,
  Separator,
  Stack,
} from '../../../../src';
import { type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

const muted = 'var(--leverui-colors-gray-muted)';
const tint = 'var(--overview-tint)';

/** A small block in the middle of a larger one. */
function AbsoluteCenterDemo(): JSX.Element {
  return (
    <Box style={{ position: 'relative', width: '100%', height: '88px', background: muted }}>
      <AbsoluteCenter>
        <Box style={{ width: '56px', height: '32px', background: tint }} />
      </AbsoluteCenter>
    </Box>
  );
}

/** A picture of the bar that shows after two rows are selected. */
function ActionBarDemo(): JSX.Element {
  return (
    <PopupSurface>
      <HStack gap="2">
        <span style={{ 'white-space': 'nowrap' }}>2 selected</span>
        <Separator orientation="vertical" style={{ height: '20px' }} />
        <Button size="xs" variant="outline">
          Delete
        </Button>
        <Button size="xs" variant="outline">
          Share
        </Button>
      </HStack>
    </PopupSurface>
  );
}

/** A wide frame and a square frame. */
function AspectRatioDemo(): JSX.Element {
  return (
    <HStack gap="3" style={{ 'align-items': 'flex-end' }}>
      <AspectRatio ratio={16 / 9} style={{ width: '128px' }}>
        <Box style={{ background: tint }}>16:9</Box>
      </AspectRatio>
      <AspectRatio ratio={1} style={{ width: '72px' }}>
        <Box style={{ background: muted }}>1:1</Box>
      </AspectRatio>
    </HStack>
  );
}

/** A block that reaches past the padding of its box. */
function BleedDemo(): JSX.Element {
  return (
    <Box style={{ width: '160px', padding: '12px', border: `1px solid ${muted}` }}>
      <Stack gap="2">
        <Box style={{ height: '14px', background: muted }} />
        <Bleed inline="3">
          <Box style={{ height: '28px', background: tint }} />
        </Bleed>
        <Box style={{ height: '14px', background: muted }} />
      </Stack>
    </Box>
  );
}

/** A short quote with the person who said it. */
function BlockquoteDemo(): JSX.Element {
  return (
    <Blockquote.Root>
      <Blockquote.Content>Good tools stay out of your way.</Blockquote.Content>
      <Blockquote.Caption>
        — <cite>Mara Ellison</cite>
      </Blockquote.Caption>
    </Blockquote.Root>
  );
}

/** The overview demos for absolute-center through blockquote, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'absolute-center': AbsoluteCenterDemo,
  'action-bar': ActionBarDemo,
  'aspect-ratio': AspectRatioDemo,
  bleed: BleedDemo,
  blockquote: BlockquoteDemo,
};
