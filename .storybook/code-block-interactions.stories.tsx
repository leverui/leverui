import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  CodeBlock,
  type CodeBlockCollapseTriggerProps,
  type CodeBlockCopyTriggerProps,
} from '../src';

type GetCollapseProps = Parameters<NonNullable<CodeBlockCollapseTriggerProps['asChild']>>[0];
type GetCopyProps = Parameters<NonNullable<CodeBlockCopyTriggerProps['asChild']>>[0];

/** Give the collapse trigger a consumer-owned native button. */
function renderCollapseButton(getProps: GetCollapseProps): JSX.Element {
  return (
    <button {...getProps({ class: 'consumer-collapse' })} data-testid="composed-collapse">
      <CodeBlock.CollapseText>{''}</CodeBlock.CollapseText>
    </button>
  );
}

/** Give the copy trigger a consumer-owned native button. */
function renderCopyButton(getProps: GetCopyProps): JSX.Element {
  return (
    <button {...getProps({ class: 'consumer-copy' })} data-testid="composed-copy">
      <CodeBlock.CopyIndicator />
    </button>
  );
}

/** Exercise keyboard, disabled, cancelled, and child-composed controls. */
function CodeBlockInteractions(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [cancelled, setCancelled] = createSignal(false);
  const [copies, setCopies] = createSignal(0);

  /** Toggle both native trigger disabled states. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  /** Toggle whether a consumer handler cancels disclosure. */
  function toggleCancellation(): void {
    setCancelled(!cancelled());
  }

  /** Keep a cancelled consumer click from changing disclosure state. */
  function handleCollapseClick(event: MouseEvent): void {
    if (cancelled()) event.preventDefault();
  }

  /** Count successful clipboard operations after the Zag machine copies. */
  function recordCopy(): void {
    setCopies(
      /** Advance the observed successful-copy count. */
      (count) => count + 1,
    );
  }

  return (
    <>
      <CodeBlock.Root
        code={'alpha\nbeta'}
        maxLines={1}
        contentId="interaction-content-id"
        copyTimeout={5000}
        onCopy={recordCopy}
      >
        <CodeBlock.Header>
          <CodeBlock.Control>
            <CodeBlock.CollapseTrigger
              asChild={renderCollapseButton}
              aria-label="Toggle code sample"
              disabled={disabled()}
              onClick={handleCollapseClick}
              data-parent="collapse"
            />
            <CodeBlock.CopyTrigger
              asChild={renderCopyButton}
              disabled={disabled()}
              data-parent="copy"
            />
          </CodeBlock.Control>
        </CodeBlock.Header>
        <CodeBlock.Content data-testid="interaction-content">
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
      <button type="button" data-testid="toggle-disabled" onClick={toggleDisabled}>
        Toggle disabled
      </button>
      <button type="button" data-testid="toggle-cancellation" onClick={toggleCancellation}>
        Toggle cancellation
      </button>
      <output data-testid="copy-count">{copies()}</output>
    </>
  );
}

const meta = {
  title: 'Content/Code Block Interactions',
  component: CodeBlockInteractions,
} satisfies Meta<typeof CodeBlockInteractions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
