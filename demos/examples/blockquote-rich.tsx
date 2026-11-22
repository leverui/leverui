import { type JSX } from '@solidjs/web';
import { QuoteIcon } from '@lucide/solid';
import { Avatar, Blockquote, Circle, Float, HStack, Span } from '../../src';
import './blockquote-avatar.css';
import './blockquote-custom-icon.css';

/** Credit the quote with a portrait and large decorative mark. */
export function BlockquoteWithAvatar(): JSX.Element {
  return (
    <Blockquote.Root class="blockquote-example-surface">
      <Float placement="bottom-end" offset="10">
        <Blockquote.Icon class="blockquote-example-avatar-icon" />
      </Float>
      <Blockquote.Content cite="Wren Ashford">
        Keep one lantern lit for the street you know and another for the street you have not found
        yet. A city is only lost when its people stop looking for the corners they have not seen.
      </Blockquote.Content>
      <Blockquote.Caption>
        <cite>
          <HStack gap="3" style={{ 'margin-top': 'var(--leverui-spacing-2)' }}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name="Wren Ashford" />
              <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
            </Avatar.Root>
            <Span style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>
              Wren Ashford
            </Span>
          </HStack>
        </cite>
      </Blockquote.Caption>
    </Blockquote.Root>
  );
}

/** Add the blue circular quote icon on the leading edge. */
export function BlockquoteWithCustomIcon(): JSX.Element {
  return (
    <Blockquote.Root colorPalette="blue" class="blockquote-example-leading-icon">
      <Float placement="middle-start">
        <Circle size="8" style={{ background: 'var(--leverui-colors-blue-600)', color: 'white' }}>
          <QuoteIcon />
        </Circle>
      </Float>
      <Blockquote.Content cite="Wren Ashford">
        Keep one lantern lit for the street you know and another for the street you have not found
        yet. A city is only lost when its people stop looking for the corners they have not seen.
      </Blockquote.Content>
      <Blockquote.Caption>
        — <cite>Wren Ashford</cite>
      </Blockquote.Caption>
    </Blockquote.Root>
  );
}

/** Float the built-in quote mark above a plain Blockquote. */
export function BlockquoteWithIcon(): JSX.Element {
  return (
    <Blockquote.Root variant="plain" colorPalette="teal">
      <Float placement="top-start" offsetY="2">
        <Blockquote.Icon />
      </Float>
      <Blockquote.Content cite="Wren Ashford">
        Keep one lantern lit for the street you know and another for the street you have not found
        yet. A city is only lost when its people stop looking for the corners they have not seen.
      </Blockquote.Content>
      <Blockquote.Caption>
        — <cite>Wren Ashford</cite>
      </Blockquote.Caption>
    </Blockquote.Root>
  );
}
