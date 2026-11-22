import {
  Box,
  HStack,
  Stack,
  StackSeparator,
  VStack,
  type StackSeparatorRenderProps,
} from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Add a consumer border color to an installed separator renderer. */
function coloredSeparator(props: StackSeparatorRenderProps): JSX.Element {
  return (
    <StackSeparator
      {...props}
      style={{ 'border-color': 'var(--leverui-colors-red-500)' }}
      id="packed-stack-colored-line"
    />
  );
}

/** Exercise installed Stack exports, native children, and live separators. */
export function PackedStack(): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);
  const [extra, setExtra] = createSignal(false);
  const first = <Box id="packed-stack-first" class="packed-box-stack-item" />;
  const middle = <Box id="packed-stack-extra" class="packed-box-stack-item" />;
  const last = <Box id="packed-stack-last" class="packed-box-stack-item" />;

  /** Rotate the installed Stack without replacing its child elements. */
  function toggleDirection(): void {
    setHorizontal(!horizontal());
  }

  /** Change the installed Stack's visible item count. */
  function toggleExtra(): void {
    setExtra(!extra());
  }

  /** Return the visible installed-package items without replacing their nodes. */
  function renderItems(): JSX.Element {
    return extra() ? [first, middle, last] : [first, last];
  }

  return (
    <section id="packed-stack-example">
      <Stack
        id="packed-stack"
        direction={horizontal() ? 'row' : 'column'}
        gap={horizontal() ? '16px' : '8px'}
        separator={StackSeparator}
        renderChildren={renderItems}
      />
      <button id="packed-stack-direction" type="button" onClick={toggleDirection}>
        Rotate
      </button>
      <button id="packed-stack-extra-toggle" type="button" onClick={toggleExtra}>
        Toggle item
      </button>
      <HStack id="packed-hstack">
        <span>One</span>
        <span>Two</span>
      </HStack>
      <VStack id="packed-vstack">
        <span>One</span>
        <span>Two</span>
      </VStack>
      <Stack id="packed-colored-stack" separator={coloredSeparator}>
        <span>One</span>
        <span>Two</span>
      </Stack>
    </section>
  );
}
