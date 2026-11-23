import { type JSX } from '@solidjs/web';
import { Box, SkipNavContent, SkipNavLink, Text } from '../../src';
import './skip-nav-panels.css';

/** Show a skip link before a simulated navigation area. */
export function SkipNavBasic(): JSX.Element {
  return (
    <Box>
      <SkipNavLink rel="external">Skip to content</SkipNavLink>
      <Box class="skip-nav-example-panel skip-nav-example-panel--gray">
        <Text
          style={{
            'font-weight': 'var(--lui-font-weights-medium)',
            'margin-bottom': 'var(--lui-spacing-2)',
          }}
        >
          Navigation
        </Text>
        <Text
          style={{
            'font-size': 'var(--lui-font-sizes-sm)',
            color: 'var(--lui-colors-gray-600)',
          }}
        >
          This stands in for a navigation area that people may want to skip.
        </Text>
      </Box>
      <SkipNavContent>
        <Box class="skip-nav-example-panel skip-nav-example-panel--blue">
          <Text
            style={{
              'font-weight': 'var(--lui-font-weights-medium)',
              'margin-bottom': 'var(--lui-spacing-2)',
            }}
          >
            Main content
          </Text>
          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
            This is the main content. Press Tab, then press Enter on the "Skip to content" link, and
            focus jumps straight here, past the navigation.
          </Text>
        </Box>
      </SkipNavContent>
    </Box>
  );
}

/** Show the matching custom target ID on both skip navigation parts. */
export function SkipNavCustomId(): JSX.Element {
  return (
    <Box>
      <SkipNavLink id="main-target" rel="external">
        Skip to main content
      </SkipNavLink>
      <Box class="skip-nav-example-panel skip-nav-example-panel--gray">
        <Text
          style={{
            'font-weight': 'var(--lui-font-weights-medium)',
            'margin-bottom': 'var(--lui-spacing-2)',
          }}
        >
          Header and navigation
        </Text>
        <Text
          style={{
            'font-size': 'var(--lui-font-sizes-sm)',
            color: 'var(--lui-colors-gray-600)',
          }}
        >
          Both parts in this example use the custom id "main-target" so that they match.
        </Text>
      </Box>
      <SkipNavContent id="main-target">
        <Box class="skip-nav-example-panel skip-nav-example-panel--green">
          <Text
            style={{
              'font-weight': 'var(--lui-font-weights-medium)',
              'margin-bottom': 'var(--lui-spacing-2)',
            }}
          >
            Main content (custom id)
          </Text>
          <Text style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
            SkipNavLink and SkipNavContent share the id "main-target". That is how the link finds
            its target and moves focus to it.
          </Text>
        </Box>
      </SkipNavContent>
    </Box>
  );
}
