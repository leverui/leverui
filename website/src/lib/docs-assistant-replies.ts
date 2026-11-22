/** The assistant's fixed replies: about itself, not found, what is here, and intents. */
import type { Answer, AnswerLink, DocsIndex } from './docs-assistant';
import type { Intent } from './docs-assistant-intents';

const about = /\b(what is|what's|tell me about) lever( ui)?\b/i;

/** The project on GitHub, for replies about the code, issues, and the license. */
const githubLink: AnswerLink = {
  title: 'Lever UI on GitHub',
  path: 'https://github.com/leverui/leverui',
  summary: 'The source code, issues, and pull requests.',
};

export const aboutAssistant: Answer = {
  kind: 'about',
  text:
    'I am a simple chat bot for Lever UI docs, not an AI model. I can help with basic ' +
    'queries about components, theming, and setup.',
  links: [],
  suggest: true,
};
export const offTopic: Answer = {
  kind: 'notFound',
  text: 'I could not find that in the Lever UI docs. I can help with its components, theming, and setup.',
  links: [],
  suggest: true,
};

/** Turn one stored search result into a link. */
export function toLink(result: Record<string, unknown>): AnswerLink {
  return {
    title: String(result['title'] ?? ''),
    path: String(result['path'] ?? ''),
    summary: String(result['summary'] ?? ''),
  };
}

/** What Lever UI includes, with the pages to start browsing from. */
export function catalog(index: DocsIndex): Answer {
  return {
    kind: 'catalog',
    text:
      `Lever UI has ${index.componentCount} components, charts, and hooks. ` +
      'Ask me about any of them, or start here:',
    links: storedLinks(index, [
      '/docs/components/concepts/overview',
      '/docs/charts',
      '/docs/getting-started',
    ]),
  };
}

/** Links to pages by their addresses, skipping any that are not in the index. */
export function storedLinks(index: DocsIndex, paths: readonly string[]): AnswerLink[] {
  return paths
    .map(
      /** Read one page's stored title and summary. */
      (path) => index.search.getStoredFields(path),
    )
    .filter(
      /** Skip a page that is not in the index. */
      (fields): fields is Record<string, unknown> => Boolean(fields),
    )
    .map(toLink);
}

/** The reply to "what is Lever UI", or nothing for any other question. */
export function whatIsReply(index: DocsIndex, text: string): Answer | undefined {
  if (!about.test(text)) return undefined;
  return {
    kind: 'whatIs',
    text: 'Lever UI is a library of accessible SolidJS components that you style with plain CSS.',
    links: storedLinks(index, ['/docs/getting-started', '/docs/components/concepts/overview']),
  };
}

/** Turn a recognized intent into an answer, with its links and any related docs pages. */
export function intentReply(
  index: DocsIndex,
  intent: Intent,
  related: readonly AnswerLink[],
): Answer {
  return {
    kind: intent.kind,
    text: intent.text,
    links: [
      ...(intent.github ? [githubLink] : []),
      ...storedLinks(index, intent.pages ?? []),
      ...related,
    ].slice(0, 3),
    suggest: intent.suggest === true,
  };
}
