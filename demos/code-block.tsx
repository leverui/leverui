import type { Demo, DemoMeta } from './demo-types';
import {
  CodeBlockBasic,
  CodeBlockWithCopyButton,
  CodeBlockWithCustomAction,
  CodeBlockWithTitle,
} from './examples/code-block-basic';
import {
  CodeBlockWithDiff,
  CodeBlockWithLineFocus,
  CodeBlockWithLineHighlight,
  CodeBlockWithLineNumbers,
} from './examples/code-block-lines';
import {
  CodeBlockWithFloatingCopyButton,
  CodeBlockWithLineNumbersWordWrap,
  CodeBlockWithMaxLines,
  CodeBlockWithSizes,
  CodeBlockWithWordWrap,
} from './examples/code-block-display';
import {
  CodeBlockPlainText,
  CodeBlockWithHorizontalOverflow,
  CodeBlockWithOverflowAndOverlay,
  CodeBlockWithThemes,
} from './examples/code-block-overflow';
import { CodeBlockWithHighlightJs } from './examples/code-block-highlight-js';
import { CodeBlockWithLanguageSwitcher } from './examples/code-block-switcher';
import { CodeBlockWithTabs } from './examples/code-block-tabs';
import { CodeBlockWithTabsSync } from './examples/code-block-tabs-sync';
import { withComponentInset } from './examples/example-frame';

export const meta = {
  component: CodeBlockBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach a guide description to one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = { render: CodeBlockBasic };
export const Sizes: Story = {
  render: CodeBlockWithSizes,
  parameters: guide('Use the `size` prop to change the size of the code block component.'),
};
export const Title: Story = {
  render: CodeBlockWithTitle,
  parameters: guide(
    'Render the `CodeBlock.Title` component within the `CodeBlock.Header` component to add a title to the code block component.',
  ),
};
export const CopyButton: Story = {
  name: 'CopyButton',
  render: CodeBlockWithCopyButton,
  parameters: guide(
    'Use the `CodeBlock.CopyTrigger` component to add a copy button to the code block component.',
  ),
};
export const LineNumbers: Story = {
  name: 'LineNumbers',
  render: CodeBlockWithLineNumbers,
  parameters: guide(
    'Line numbers make it easier to reference specific lines of code. Pass the `meta.showLineNumbers` prop to show line numbers in the code block component.',
  ),
};
export const LineHighlighting: Story = {
  name: 'LineHighlighting',
  render: CodeBlockWithLineHighlight,
  parameters: guide(
    'Pass the `meta.highlightLines` prop to the `CodeBlock.Root` component to highlight specific lines of code. The prop accepts an array of line numbers.',
  ),
};
export const LineFocusing: Story = {
  name: 'LineFocusing',
  render: CodeBlockWithLineFocus,
  parameters: guide(
    'Pass the `meta.focusedLineNumbers` prop to the `CodeBlock.Root` component to focus specific lines of code. The prop accepts an array of line numbers.',
  ),
};
export const Diff: Story = {
  render: CodeBlockWithDiff,
  parameters: guide(
    'Diffs are useful for highlighting source code changes. Use the `meta.addedLineNumbers` and `meta.removedLineNumbers` props to add line numbers to the code block component. The prop accepts an array of line numbers. The line numbers are 1-based.',
  ),
};
export const MaxLines: Story = {
  name: 'MaxLines',
  render: CodeBlockWithMaxLines,
  parameters: guide(
    'Use the `meta.maxLines` prop to limit the number of lines in the code block component. By default, the code block component will expand to fit the content.',
  ),
};
export const LanguageSwitcher: Story = {
  name: 'LanguageSwitcher',
  render: CodeBlockWithLanguageSwitcher,
  parameters: guide(
    "Here's an example that re-creates an API endpoint request component by composing the `CodeBlock` and `Select` components.",
  ),
};
export const FloatingCopyButton: Story = {
  name: 'FloatingCopyButton',
  render: CodeBlockWithFloatingCopyButton,
  parameters: guide(
    "Here's an example that adds a floating copy button to the code block component.",
  ),
};
export const Tabs: Story = {
  render: CodeBlockWithTabs,
  parameters: guide(
    "Here's an example that composes the `CodeBlock` component with the `Tabs` component to create a code block with tabs.",
  ),
};
export const TabsSync: Story = {
  name: 'TabsSync',
  render: CodeBlockWithTabsSync,
  parameters: guide(
    "Here's an example that automatically syncs all code blocks that share the same storage key. Useful for package manager or framework specific code blocks in a documentation site.",
  ),
};
export const Themes: Story = {
  render: CodeBlockWithThemes,
  parameters: guide(
    'Use the `meta.colorScheme` prop to add a theme to the code block component. In this example, the colorScheme follows the system color scheme through the `useMediaQuery` hook.',
  ),
};
export const WordWrap: Story = {
  name: 'WordWrap',
  render: CodeBlockWithWordWrap,
  parameters: guide('Use the `meta.wordWrap` prop to wrap the code block component.'),
};
export const LineNumbersWordWrap: Story = {
  name: 'LineNumbersWordWrap',
  render: CodeBlockWithLineNumbersWordWrap,
  parameters: guide(
    'You can combine line numbers with word wrapping by setting both `meta.showLineNumbers` and `meta.wordWrap` to `true`. The line numbers will properly align with wrapped text.',
  ),
};
export const HighlightJs: Story = {
  name: 'HighlightJs',
  render: CodeBlockWithHighlightJs,
  parameters: guide("Here's an example that uses highlight.js to highlight the code block."),
};
export const PlainText: Story = {
  name: 'PlainText',
  render: CodeBlockPlainText,
  parameters: guide(
    'The code block falls back to a plain text by default. To create a plain text code block, remove the use of `CodeBlock.AdapterProvider`.',
  ),
};
export const CustomAction: Story = { name: 'CustomAction', render: CodeBlockWithCustomAction };
export const HorizontalOverflow: Story = {
  name: 'HorizontalOverflow',
  render: CodeBlockWithHorizontalOverflow,
};
export const OverflowAndOverlay: Story = {
  name: 'OverflowAndOverlay',
  render: CodeBlockWithOverflowAndOverlay,
};
