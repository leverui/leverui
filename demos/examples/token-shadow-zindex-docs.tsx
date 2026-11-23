import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Center, Flex, SimpleGrid, Stack, Text, VStack } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries } from './token-doc-css';
import './token-doc-flex.css';

/** Display every semantic shadow on a separate sample surface. */
export function TokensShadows(): JSX.Element {
  return (
    <TokenDoc title="theme.semanticTokens.shadows" my="8">
      <SimpleGrid minChildWidth="240px" style={{ gap: 'var(--lui-spacing-4)' }}>
        <For each={['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner', 'inset']}>
          {
            /** Show one shadow on a default-sized surface. */
            (shadow) => (
              <VStack style={{ flex: '1' }}>
                <Center
                  style={{
                    'box-shadow': `var(--lui-shadows-${shadow})`,
                    width: '100%',
                    height: 'var(--lui-sizes-20)',
                    color: 'var(--lui-colors-fg-muted)',
                    'border-radius': 'var(--lui-radii-md)',
                  }}
                />
                <Box>{shadow}</Box>
              </VStack>
            )
          }
        </For>
      </SimpleGrid>
    </TokenDoc>
  );
}

/** List layer-order tokens by their numeric value. */
export function TokensZIndex(): JSX.Element {
  const values = tokenDocEntries('zIndex').sort(
    /** Preserve the ascending numeric order. */
    (first, second) =>
      parseFloat(String(first.originalValue)) - parseFloat(String(second.originalValue)),
  );
  return (
    <TokenDoc title="theme.tokens.zIndex" mt="8">
      <Flex class="token-doc-flex-header">
        <Text style={{ width: '100px' }}>Name</Text>
        <Text style={{ width: '100px' }}>Value</Text>
      </Flex>
      <Stack
        style={{
          'padding-inline': 'var(--lui-spacing-3)',
          'padding-top': 'var(--lui-spacing-2)',
        }}
      >
        <For each={values}>
          {
            /** List a token's name and numeric layer value. */
            (token) => (
              <Flex class="token-doc-flex-row">
                <Text style={{ width: '100px', 'font-weight': 'var(--lui-font-weights-medium)' }}>
                  {token.extensions.prop}
                </Text>
                <Text style={{ width: '100px', color: 'var(--lui-colors-fg-muted)' }}>
                  {token.originalValue}
                </Text>
              </Flex>
            )
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}
