import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Flex, Stack, Text } from '../../src';
import { TokenDoc } from './token-doc-frame';
import { tokenDocEntries, type TokenDocEntry } from './token-doc-css';
import './token-doc-flex.css';

const sizes = tokenDocEntries('sizes');
const fractionalSizes = sizes.filter(
  /** Select fraction labels such as 1/2. */
  (token) => token.name.includes('/'),
);
const namedSizes = sizes.filter(
  /** Select semantic names and viewport dimensions. */
  (token) => /v(h|w)|min|max|fit|prose|full/.test(token.name),
);
const breakpointSizes = sizes.filter(
  /** Select sizes derived from named breakpoints. */
  (token) => token.name.includes('breakpoint'),
);
const largeSizes = sizes.filter(
  /** Select the large semantic size scale outside breakpoint values. */
  (token) => /sm|xl|xs|lg|md/.test(token.name) && !breakpointSizes.includes(token),
);
const tokenSizes = sizes
  .filter(
    /** Keep only the numeric size scale for the first table. */
    (token) =>
      !fractionalSizes.includes(token) &&
      !namedSizes.includes(token) &&
      !breakpointSizes.includes(token) &&
      !largeSizes.includes(token),
  )
  .sort(
    /** Keep the numbered size scale in increasing pixel order. */
    (first, second) =>
      parseInt(first.extensions.pixelValue ?? '0') - parseInt(second.extensions.pixelValue ?? '0'),
  );

interface SizeGroup {
  name: string;
  tokens: TokenDocEntry[];
}

const sizeGroups: SizeGroup[] = [
  { name: 'tokenSizes', tokens: tokenSizes },
  { name: 'namedSizes', tokens: namedSizes },
  { name: 'fractionalSizes', tokens: fractionalSizes },
  { name: 'breakpointSizes', tokens: breakpointSizes },
  { name: 'largeSizes', tokens: largeSizes },
];

/** Show token, named, fraction, breakpoint, and large size tables. */
export function TokensSizes(): JSX.Element {
  return (
    <Stack gap="8" style={{ 'margin-top': 'var(--leverui-spacing-8)' }}>
      <For each={sizeGroups}>
        {
          /** Render one grouped size table. */
          (group) => (
            <TokenDoc title={group.name}>
              <Flex class="token-doc-flex-header">
                <Text style={{ width: '160px' }}>Name</Text>
                <Text style={{ width: '100px' }}>Value</Text>
                {group.name === 'tokenSizes' && <Text style={{ width: '100px' }}>Pixel</Text>}
              </Flex>
              <Stack
                style={{
                  'padding-inline': 'var(--leverui-spacing-3)',
                  'padding-top': 'var(--leverui-spacing-2)',
                }}
              >
                <For each={group.tokens}>
                  {
                    /** Display one size value and its optional pixel bar. */
                    (token) => (
                      <Flex class="token-doc-flex-row">
                        <Text
                          style={{
                            width: '160px',
                            'font-weight': 'var(--leverui-font-weights-medium)',
                          }}
                        >
                          {token.extensions.prop}
                        </Text>
                        <Text style={{ width: '100px', color: 'var(--leverui-colors-fg-muted)' }}>
                          {token.value}
                        </Text>
                        {group.name === 'tokenSizes' && (
                          <>
                            <Text
                              style={{ width: '100px', color: 'var(--leverui-colors-fg-muted)' }}
                            >
                              {token.extensions.pixelValue}
                            </Text>
                            <Box
                              style={{
                                background: 'var(--leverui-colors-pink-200)',
                                height: 'var(--leverui-sizes-4)',
                                width: `min(${token.originalValue}, 60%)`,
                              }}
                            />
                          </>
                        )}
                      </Flex>
                    )
                  }
                </For>
              </Stack>
            </TokenDoc>
          )
        }
      </For>
    </Stack>
  );
}

/** List nonnegative spacing tokens with their rendered size bars. */
export function TokensSpacing(): JSX.Element {
  const spacing = tokenDocEntries('spacing')
    .filter(
      /** Omit generated negative and non-spacing values. */
      (token) => token.extensions.category === 'spacing' && !token.extensions.negative,
    )
    .sort(
      /** Preserve numeric progression through the spacing scale. */
      (first, second) => parseFloat(String(first.value)) - parseFloat(String(second.value)),
    );
  return (
    <TokenDoc title="theme.tokens.spacing" mt="8">
      <Flex class="token-doc-flex-header">
        <Text style={{ width: '100px' }}>Name</Text>
        <Text style={{ width: '100px' }}>Value</Text>
        <Text style={{ width: '100px' }}>Pixel</Text>
      </Flex>
      <Stack
        style={{
          'padding-inline': 'var(--leverui-spacing-3)',
          'padding-top': 'var(--leverui-spacing-2)',
        }}
      >
        <For each={spacing}>
          {
            /** Display one spacing value and its length bar. */
            (token) => (
              <Flex class="token-doc-flex-row">
                <Text
                  style={{ width: '100px', 'font-weight': 'var(--leverui-font-weights-medium)' }}
                >
                  {token.extensions.prop}
                </Text>
                <Text style={{ width: '100px', color: 'var(--leverui-colors-fg-muted)' }}>
                  {token.value}
                </Text>
                <Text style={{ width: '100px', color: 'var(--leverui-colors-fg-muted)' }}>
                  {token.extensions.pixelValue}
                </Text>
                <Box style={{ flex: '1' }}>
                  <Box
                    style={{
                      background: 'var(--leverui-colors-pink-200)',
                      height: 'var(--leverui-sizes-4)',
                      width: token.extensions.cssVar?.ref,
                    }}
                  />
                </Box>
              </Flex>
            )
          }
        </For>
      </Stack>
    </TokenDoc>
  );
}
