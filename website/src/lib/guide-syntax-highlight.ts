import { createHighlighter, type Highlighter } from 'shiki';

export type HighlightedLines = ReturnType<Highlighter['codeToTokensBase']>;

const languages = [
  'tsx',
  'typescript',
  'javascript',
  'css',
  'html',
  'json',
  'bash',
  'markdown',
] as const;
const languageAliases: Record<string, (typeof languages)[number]> = {
  ts: 'typescript',
  js: 'javascript',
  jsx: 'tsx',
  sh: 'bash',
  md: 'markdown',
};
const highlighter = await createHighlighter({ themes: ['dark-plus'], langs: [...languages] });

/** Choose a supported grammar from a Markdown fence or filename. */
export function codeLanguage(className = '', label = ''): (typeof languages)[number] {
  const fence = /(?:^|\s)language-([\w-]+)/.exec(className)?.[1];
  const extension = label.split('.').at(-1);
  const candidate = fence ?? extension ?? 'tsx';
  const normalized = languageAliases[candidate] ?? candidate;
  return languages.find((language) => language === normalized) ?? 'tsx';
}

/** Tokenize source with the site's grammar and theme. */
export function highlightGuideCode(
  code: string,
  language: ReturnType<typeof codeLanguage>,
): HighlightedLines {
  return highlighter.codeToTokensBase(code, { lang: language, theme: 'dark-plus' });
}
