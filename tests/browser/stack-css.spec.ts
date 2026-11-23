import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type {
  HStack as HStackExport,
  Stack as StackExport,
  StackProps,
  StackSeparator as SeparatorExport,
  VStack as VStackExport,
} from '../../src';

type ServerExports = {
  HStack: typeof HStackExport;
  Stack: typeof StackExport;
  StackSeparator: typeof SeparatorExport;
  VStack: typeof VStackExport;
};

const serverEntry = '../../dist/server/index.js';
const { HStack, Stack, StackSeparator, VStack } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Add a consumer hook while retaining Stack's separator class. */
function renderConsumerSeparator(props: { class: string }): JSX.Element {
  return createComponent(StackSeparator, { class: `${props.class} consumer-separator` });
}

/** Render Stack variants and a responsive separator without runtime CSS. */
function renderPlainStacks(): JSX.Element {
  return [
    createComponent(Stack, {
      id: 'plain-stack',
      class: 'consumer-stack',
      children: 'Plain stack',
    }),
    createComponent(HStack, {
      id: 'plain-hstack',
      children: 'Horizontal stack',
    }),
    createComponent(VStack, {
      id: 'plain-vstack',
      children: 'Vertical stack',
    }),
    createComponent<StackProps>(Stack, {
      id: 'separator-stack',
      direction: { base: 'column', md: 'row' },
      gap: { base: '4', md: '6' },
      separator: StackSeparator,
      children: [
        createComponent(Dynamic, { component: 'span', children: 'First' }),
        createComponent(Dynamic, { component: 'span', children: 'Second' }),
      ],
    }),
    createComponent(Stack, {
      id: 'consumer-separator-stack',
      separator: renderConsumerSeparator,
      children: [
        createComponent(Dynamic, { component: 'span', children: 'Before' }),
        createComponent(Dynamic, { component: 'span', children: 'After' }),
      ],
    }),
    createComponent(Stack, {
      id: 'unstyled-stack',
      class: 'consumer-unstyled',
      unstyled: true,
      children: 'Unstyled content',
    }),
    createComponent(StackSeparator, {
      id: 'unstyled-separator',
      class: 'consumer-unstyled-separator',
      unstyled: true,
    }),
  ];
}

/** Check script-free spacing, separator axes, and consumer cascade control. */
async function verifiesStackCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainStacks);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const plain = page.locator('#plain-stack');
  const separated = page.locator('#separator-stack');
  const line = separated.locator('.lui-stack-separator');
  await expect(plain).toHaveCSS('display', 'flex');
  await expect(plain).toHaveCSS('flex-direction', 'column');
  await expect(plain).toHaveCSS('gap', '8px');
  await expect(page.locator('#plain-hstack')).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('#plain-vstack')).toHaveCSS('align-items', 'center');
  await expect(line).toHaveCount(1);
  await expect(separated).toHaveCSS('gap', 'normal');
  await expect(line).toHaveCSS('margin-top', '16px');
  await expect(line).toHaveCSS('border-top-width', '1px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(separated).toHaveCSS('flex-direction', 'row');
  await expect(line).toHaveCSS('margin-left', '24px');
  await expect(line).toHaveCSS('border-inline-start-width', '1px');
  const unstyled = page.locator('#unstyled-stack');
  await expect(unstyled).toHaveClass(/lui-stack/);
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('display', 'block');
  const unstyledSeparator = page.locator('#unstyled-separator');
  await expect(unstyledSeparator).toHaveClass(/lui-stack-separator/);
  await expect(unstyledSeparator).toHaveAttribute('data-unstyled', '');
  await expect(unstyledSeparator).toHaveCSS('align-self', 'auto');
  await page.addStyleTag({
    content:
      '.consumer-stack { gap: 20px; } .consumer-separator { border-top-color: rgb(30, 50, 70); border-top-width: 3px; } .consumer-unstyled { display: flex; } .consumer-unstyled-separator { align-self: center; }',
  });
  await expect(plain).toHaveCSS('gap', '20px');
  const consumerLine = page.locator('#consumer-separator-stack .consumer-separator');
  await expect(consumerLine).toHaveClass(/lui-stack-separator/);
  await expect(consumerLine).toHaveCSS('border-top-color', 'rgb(30, 50, 70)');
  await expect(consumerLine).toHaveCSS('border-top-width', '3px');
  await expect(unstyled).toHaveCSS('display', 'flex');
  await expect(unstyledSeparator).toHaveCSS('align-self', 'center');
}

test('Stack layout and separators use authored CSS before hydration', verifiesStackCss);

/** Render a native-styled root with an authored separator. */
function renderStyledStack(): JSX.Element {
  return createComponent<StackProps>(Stack, {
    id: 'mixed-stack',
    style: { padding: 'var(--lui-spacing-4)' },
    direction: 'row',
    gap: '8px',
    separator: StackSeparator,
    children: [
      createComponent(Dynamic, { component: 'span', children: 'First' }),
      createComponent(Dynamic, { component: 'span', children: 'Second' }),
    ],
  });
}

/** Preserve separator spacing when the Stack root has native style. */
async function verifiesStyledStack({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderStyledStack);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const stack = page.locator('#mixed-stack');
  const line = stack.locator('.lui-stack-separator');
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(line).toHaveClass(/lui-stack-separator/);
  await expect(line).toHaveCSS('margin-left', '8px');
  await expect(line).toHaveCSS('border-inline-start-width', '1px');
}

test('native StackSeparator follows a styled Stack root', verifiesStyledStack);
