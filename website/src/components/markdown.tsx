import { dynamic, type JSX } from '@solidjs/web';
import type { Element, ElementContent, Properties, Root, RootContent } from 'hast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { gfm } from 'micromark-extension-gfm';
import { find, html } from 'property-information';
import { createMemo, type Component } from 'solid-js';

/** Props given to a component that replaces one Markdown element. */
export interface MarkdownElementProps {
  /** The parsed element, for components that read its text or structure. */
  readonly node: Element;
  readonly children?: JSX.Element;
  readonly class?: string | undefined;
  /** True for `code` outside a fenced block. */
  readonly inline?: boolean | undefined;
}

/** Components that replace Markdown elements, keyed by tag name. */
export type MarkdownComponents = Readonly<Partial<Record<string, Component<MarkdownElementProps>>>>;

type AttributeValue = string | number | boolean;

/** Parse GitHub-flavoured Markdown into an HTML syntax tree without raw HTML. */
function parseMarkdown(source: string): Root {
  const tree = toHast(
    fromMarkdown(source, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] }),
  );
  return tree.type === 'root' ? tree : { type: 'root', children: [] };
}

/** Convert hast properties to the HTML attribute names Solid renders. */
function elementAttributes(properties: Properties): Record<string, AttributeValue> {
  const attributes: Record<string, AttributeValue> = {};
  for (const [property, value] of Object.entries(properties)) {
    if (value === null || value === undefined || Number.isNaN(value)) continue;
    const info = find(html, property);
    const name = info.property === 'className' ? 'class' : info.attribute;
    attributes[name] = Array.isArray(value) ? value.join(info.commaSeparated ? ', ' : ' ') : value;
  }
  return attributes;
}

/** Move a table cell's GFM alignment into an inline style. */
function cellAttributes(
  attributes: Record<string, AttributeValue>,
): Record<string, AttributeValue> {
  const { align, ...rest } = attributes;
  return align === undefined ? rest : { ...rest, style: `text-align: ${String(align)}` };
}

/** Render one element, through its replacement component when one is given. */
function renderElement(
  node: Element,
  parent: Root | Element,
  components: MarkdownComponents,
): JSX.Element {
  const isCell = node.tagName === 'td' || node.tagName === 'th';
  const attributes = isCell
    ? cellAttributes(elementAttributes(node.properties))
    : elementAttributes(node.properties);
  const Replacement = components[node.tagName];
  if (Replacement) {
    const className = attributes['class'];
    return (
      <Replacement
        node={node}
        class={typeof className === 'string' ? className : undefined}
        inline={node.tagName === 'code' && parent.type === 'element' && parent.tagName !== 'pre'}
      >
        {renderChildren(node, components)}
      </Replacement>
    );
  }
  const Tag = dynamic(() => node.tagName, { static: true });
  return node.children.length > 0 ? (
    <Tag {...attributes}>{renderChildren(node, components)}</Tag>
  ) : (
    <Tag {...attributes} />
  );
}

/** Render one parsed node: elements and text, skipping comments and bare newlines. */
function renderContent(
  node: RootContent | ElementContent,
  parent: Root | Element,
  components: MarkdownComponents,
): JSX.Element {
  if (node.type === 'element') return renderElement(node, parent, components);
  if (node.type === 'text' && node.value !== '\n') return node.value;
  return null;
}

/** Render a parent's children in document order. */
function renderChildren(parent: Root | Element, components: MarkdownComponents): JSX.Element {
  return parent.children.map(
    /** Render one child of the parsed parent. */
    (child) => renderContent(child, parent, components),
  );
}

/** Render GitHub-flavoured Markdown as Solid elements, replacing the given tags. */
export function Markdown(props: {
  content: string;
  components?: MarkdownComponents | undefined;
}): JSX.Element {
  const tree = createMemo(
    /** Reparse when the guide content changes during client navigation. */
    () => parseMarkdown(props.content),
  );
  return <div>{renderChildren(tree(), props.components ?? {})}</div>;
}
