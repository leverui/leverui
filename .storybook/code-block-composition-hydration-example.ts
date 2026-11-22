import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { CodeBlock, Tabs } from '../dist/index.js';
import { renderSyncedCodeTabs, type CodeTabsComponents } from './code-block-composition-tabs-tree';

const publishedComponents: CodeTabsComponents = {
  CodeBlockRoot: CodeBlock.Root,
  CodeBlockHeader: CodeBlock.Header,
  CodeBlockCopyTrigger: CodeBlock.CopyTrigger,
  CodeBlockCopyIndicator: CodeBlock.CopyIndicator,
  CodeBlockContent: CodeBlock.Content,
  CodeBlockCode: CodeBlock.Code,
  CodeBlockCodeText: CodeBlock.CodeText,
  TabsRoot: Tabs.Root,
  TabsList: Tabs.List,
  TabsTrigger: Tabs.Trigger,
  TabsContent: Tabs.Content,
};

/** Hydrate the same tabbed Code Block tree used by the Storybook composition. */
export function hydrateCodeTabsExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its interactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the published server's default selection before restoring storage. */
  function renderExample(): JSX.Element {
    const tree = renderSyncedCodeTabs(publishedComponents, 'hydrated');
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
