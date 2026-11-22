import { dynamic, type JSX } from '@solidjs/web';
import { sectionId } from '../lib/guide-sections';
import type { MarkdownComponents, MarkdownElementProps } from './markdown';
import '../styles/guide-headings.css';

/** Read text from a Markdown heading's syntax tree. */
function headingText(node: unknown): string {
  if (typeof node !== 'object' || node === null) return '';
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(headingText).join('');
  }
  return '';
}

/** Render a level-two heading with a shareable anchor. */
function GuideH2(props: MarkdownElementProps): JSX.Element {
  /** Read the heading's anchor id from its text. */
  const id = (): string => sectionId(headingText(props.node));
  return (
    <h2 id={id()}>
      <a class="guide-heading-anchor" href={`#${id()}`}>
        {props.children}
      </a>
    </h2>
  );
}

/** Render a level-three heading with a shareable anchor. */
function GuideH3(props: MarkdownElementProps): JSX.Element {
  /** Read the heading's anchor id from its text. */
  const id = (): string => sectionId(headingText(props.node));
  return (
    <h3 id={id()}>
      <a class="guide-heading-anchor" href={`#${id()}`}>
        {props.children}
      </a>
    </h3>
  );
}

export const guideHeadingComponents: MarkdownComponents = {
  h2: GuideH2,
  h3: GuideH3,
};

/** Render a heading that links to itself. */
export function LinkedHeading(props: {
  level: 'h2' | 'h3';
  id: string;
  class?: string;
  children: JSX.Element;
}): JSX.Element {
  const Heading = dynamic(
    /** Render the heading level the caller chose. */
    () => props.level,
  );
  return (
    <Heading id={props.id} class={props.class}>
      <a class="guide-heading-anchor" href={`#${props.id}`}>
        {props.children}
      </a>
    </Heading>
  );
}
