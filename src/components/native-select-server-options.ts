import { parseFragment, type DefaultTreeAdapterTypes } from 'parse5';
import { type JSX } from '@solidjs/web';
import { resolveSSRNode, ssr } from '@solidjs/web';
import type { NativeSelectValue } from './native-select-option-values';
import { nativeSelectValues } from './native-select-option-values';

type HtmlElement = DefaultTreeAdapterTypes.Element;
type HtmlNode = DefaultTreeAdapterTypes.ChildNode;
type ServerOptionNode = JSX.Element & ReturnType<typeof ssr>;

interface HtmlPatch {
  start: number;
  end: number;
  text: string;
}

/** Gather option elements without changing their existing hydration markup. */
function collectOptions(parent: DefaultTreeAdapterTypes.ParentNode, options: HtmlElement[]): void {
  for (const child of parent.childNodes) {
    if (!('tagName' in child)) continue;
    if (child.tagName === 'option') options.push(child);
    collectOptions(child, options);
  }
}

/** Read an option's text when it has no explicit value attribute. */
function optionText(node: HtmlNode): string {
  if ('value' in node) return node.value;
  if (!('childNodes' in node)) return '';
  let content = '';
  for (const child of node.childNodes) content += optionText(child);
  return content;
}

/** Match the native option value, including entity-decoded attributes. */
function optionValue(option: HtmlElement): string {
  for (const attribute of option.attrs) {
    if (attribute.name === 'value') return attribute.value;
  }
  return optionText(option)
    .replace(/[\t\n\f\r ]+/g, ' ')
    .trim();
}

/** Change only option start tags so Solid's hydration keys remain intact. */
function applyPatches(html: string, patches: HtmlPatch[]): string {
  patches.sort(
    /** Apply edits from the end so earlier source offsets stay valid. */
    (left, right) => right.start - left.start,
  );
  let result = html;
  for (const patch of patches) {
    result = result.slice(0, patch.start) + patch.text + result.slice(patch.end);
  }
  return result;
}

/** Mark the matching server options using parsed HTML source locations. */
export function selectedServerOptions(
  children: JSX.Element,
  value: NativeSelectValue,
  multiple: boolean,
): JSX.Element {
  const prefix = '<select>';
  const suffix = '</select>';
  // Solid 2 resolves server children to template strings plus any async holes.
  // Options with async content cannot be patched as text, so they pass through.
  const resolved: { t: string[]; h: unknown[] } = resolveSSRNode(children);
  if (resolved.h.length > 0) return children;
  const wrapped = `${prefix}${resolved.t.join('')}${suffix}`;
  const fragment = parseFragment(wrapped, { sourceCodeLocationInfo: true });
  const options: HtmlElement[] = [];
  collectOptions(fragment, options);
  const values = nativeSelectValues(value);
  const patches: HtmlPatch[] = [];
  let matched = false;

  for (const option of options) {
    const selected = values.has(optionValue(option)) && (multiple || !matched);
    if (selected) matched = true;
    const tag = option.sourceCodeLocation?.startTag;
    if (!tag) throw new Error('Native Select could not locate a server option start tag.');
    const selectedAttribute = option.sourceCodeLocation?.attrs?.selected;
    if (selected && !selectedAttribute) {
      const end = wrapped[tag.endOffset - 2] === '/' ? tag.endOffset - 2 : tag.endOffset - 1;
      patches.push({ start: end, end, text: ' selected=""' });
    } else if (!selected && selectedAttribute) {
      patches.push({
        start: selectedAttribute.startOffset,
        end: selectedAttribute.endOffset,
        text: '',
      });
    }
  }

  const html = applyPatches(wrapped, patches).slice(prefix.length, -suffix.length);
  // Solid's server renderer accepts this node as a child, although JSX omits its server shape.
  return ssr(html) as ServerOptionNode;
}
