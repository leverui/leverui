import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CodeBlock } from '../src';

/** Render the native code parts used by each theme specimen. */
function CodeBody(props: { testId: string }): JSX.Element {
  return (
    <CodeBlock.Content>
      <CodeBlock.Code data-testid={props.testId}>
        <CodeBlock.CodeText />
      </CodeBlock.Code>
    </CodeBlock.Content>
  );
}

/** Exercise authored CSS variables, unstyled parts, and nested size scopes. */
function CodeBlockThemeExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change only the outer root's finite size selector. */
  function toggleOuterSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <CodeBlock.Root
        code="const custom = true"
        data-testid="theme-custom-root"
        style={{ '--lui-code-block-radius': '19px', 'border-width': '4px' }}
      >
        <CodeBlock.Header>
          <CodeBlock.Title data-testid="theme-custom-title">custom.ts</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBody testId="theme-custom-code" />
      </CodeBlock.Root>

      <CodeBlock.Root code="Unstyled source" unstyled data-testid="theme-unstyled-root">
        <CodeBody testId="theme-unstyled-code" />
      </CodeBlock.Root>

      <CodeBlock.Root
        code="Outer source"
        size={large() ? 'lg' : 'sm'}
        data-testid="theme-outer-root"
      >
        <CodeBody testId="theme-outer-code" />
        <CodeBlock.Root code="Inner source" size="md" data-testid="theme-inner-root">
          <CodeBody testId="theme-inner-code" />
        </CodeBlock.Root>
      </CodeBlock.Root>

      <CodeBlock.Root code="CSS override" data-testid="theme-css-root">
        <CodeBody testId="theme-css-code" />
      </CodeBlock.Root>
      <CodeBlock.Root
        code="Native style"
        style={{ 'border-width': '5px', 'border-color': 'var(--lui-colors-purple-500)' }}
        data-testid="theme-instance-css-root"
      >
        <CodeBody testId="theme-instance-css-code" />
      </CodeBlock.Root>
      <button type="button" data-testid="theme-size-toggle" onClick={toggleOuterSize}>
        Toggle outer size
      </button>
    </>
  );
}

const meta = {
  title: 'Internal/Code Block Theme',
  component: CodeBlockThemeExample,
} satisfies Meta<typeof CodeBlockThemeExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
