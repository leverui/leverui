import { type JSX } from '@solidjs/web';
import { CodeBlock, Tabs } from '../src';
import { renderSyncedCodeTabs, type CodeTabsComponents } from './code-block-composition-tabs-tree';

export interface SyncedCodeTabsProps {
  name: string;
}

export const codeTabsClientComponents: CodeTabsComponents = {
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

/** Render the reusable composition with client-side Lever UI components. */
export function SyncedCodeTabs(props: SyncedCodeTabsProps): JSX.Element {
  return renderSyncedCodeTabs(codeTabsClientComponents, props.name);
}
