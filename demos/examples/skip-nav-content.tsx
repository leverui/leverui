import { type JSX } from '@solidjs/web';
import { Box, Heading, SkipNavContent, SkipNavLink, Text, VStack } from '../../src';
import './skip-nav-panels.css';

/** Show a skip link targeting a larger content section below a site header. */
export function SkipNavWithContent(): JSX.Element {
  return (
    <Box>
      <SkipNavLink rel="external">Skip to content</SkipNavLink>
      <Box class="skip-nav-example-panel skip-nav-example-panel--gray">
        <Text
          style={{
            'font-weight': 'var(--leverui-font-weights-medium)',
            'margin-bottom': 'var(--leverui-spacing-2)',
          }}
        >
          Site header
        </Text>
        <VStack align="start" gap="1">
          <Text
            style={{
              'font-size': 'var(--leverui-font-sizes-sm)',
              color: 'var(--leverui-colors-gray-600)',
            }}
          >
            • Home
          </Text>
          <Text
            style={{
              'font-size': 'var(--leverui-font-sizes-sm)',
              color: 'var(--leverui-colors-gray-600)',
            }}
          >
            • About
          </Text>
          <Text
            style={{
              'font-size': 'var(--leverui-font-sizes-sm)',
              color: 'var(--leverui-colors-gray-600)',
            }}
          >
            • Services
          </Text>
          <Text
            style={{
              'font-size': 'var(--leverui-font-sizes-sm)',
              color: 'var(--leverui-colors-gray-600)',
            }}
          >
            • Contact
          </Text>
        </VStack>
      </Box>
      <SkipNavContent>
        <Box class="skip-nav-example-panel skip-nav-example-panel--purple">
          <Heading size="lg" class="skip-nav-example-heading">
            Welcome to our site
          </Heading>
          <VStack align="start" gap="4">
            <Text>
              This is the main content. SkipNavContent wraps this whole section, so the skip link
              moves focus here.
            </Text>
            <Text>
              When someone using a keyboard presses Tab to reach the "Skip to content" link and then
              presses Enter, focus jumps straight to this section, past all the navigation items
              above.
            </Text>
            <Text
              style={{
                'font-size': 'var(--leverui-font-sizes-sm)',
                color: 'var(--leverui-colors-purple-600)',
              }}
            >
              This helps people who use a screen reader and people who get around mostly with a
              keyboard.
            </Text>
          </VStack>
        </Box>
      </SkipNavContent>
    </Box>
  );
}
