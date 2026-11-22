import type { JSX } from '@solidjs/web';
import type { MarkdownElementProps } from './markdown';
import '../styles/guide-tables.css';

interface HastNode {
  readonly type: string;
  readonly tagName?: string;
  readonly value?: string;
  readonly children?: readonly HastNode[];
}

const propsHeadings = ['Prop', 'Default', 'Type', 'Description'];

/** Read the plain text inside a parsed Markdown node. */
function nodeText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(nodeText).join('');
}

/** Find the first descendant element with a tag name. */
function findElement(node: HastNode, tagName: string): HastNode | undefined {
  for (const child of node.children ?? []) {
    if (child.tagName === tagName) return child;
    const nested = findElement(child, tagName);
    if (nested) return nested;
  }
  return undefined;
}

/** Report whether a Markdown table lists component props as Prop, Default, Type, Description. */
function isPropsTable(node: HastNode): boolean {
  const header = findElement(node, 'tr');
  const cells = (header?.children ?? []).filter(
    /** Keep the header cells. */
    (child) => child.tagName === 'th',
  );
  return (
    cells.length === propsHeadings.length &&
    cells.every(
      /** Match each header cell in order. */
      (cell, index) => nodeText(cell).trim() === propsHeadings[index],
    )
  );
}

/** Lay out props tables with each description under its type. */
export function MarkdownTable(props: MarkdownElementProps): JSX.Element {
  return (
    <table class={[props.class, { 'guide-props-table': isPropsTable(props.node) }]}>
      {props.children}
    </table>
  );
}
