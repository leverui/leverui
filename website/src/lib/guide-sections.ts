export interface GuideSection {
  readonly title: string;
  readonly id: string;
  readonly depth: 2 | 3;
}

/** Turn a Markdown heading into a stable page anchor. */
export function sectionId(title: string): string {
  return title
    .replace(/[`*_\[\]]/g, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** List the second- and third-level headings for page navigation. */
export function guideSections(markdown: string): readonly GuideSection[] {
  return [...markdown.matchAll(/^(##|###) (.+)$/gm)].map(
    /** Keep every link aligned with its rendered heading. */
    (match) => ({
      title: match[2] ?? '',
      id: sectionId(match[2] ?? ''),
      depth: match[1] === '###' ? 3 : 2,
    }),
  );
}

/**
 * Split a guide into its opening paragraph and the rest. A guide that opens with a heading,
 * code, a list, a table or a note has no opening paragraph.
 */
function splitLead(markdown: string): { lead: string; rest: string } {
  const withoutTitle = markdown.replace(/^# .+\r?\n+/, '');
  const firstBlock = withoutTitle.split(/\r?\n\s*\r?\n/, 1)[0] ?? '';
  if (/^(#|```|~~~|[-*+] |\d+\. |\||>)/.test(firstBlock)) return { lead: '', rest: withoutTitle };
  return { lead: firstBlock, rest: withoutTitle.slice(firstBlock.length).trimStart() };
}

/** A guide's opening paragraph as Markdown, so its code and links keep their formatting. */
export function guideLead(markdown: string): string {
  return splitLead(markdown).lead.trim();
}

/** Move a component guide's title and lead above its rendered body. */
export function guideBody(markdown: string, component: boolean): string {
  if (!component) return markdown.replace(/^# .+\r?\n+/, '');
  return splitLead(markdown).rest;
}

/**
 * Guides whose opening setup sections render above the Usage snippet, keyed by
 * the guide's slug. Every other guide treats its content as Usage onward.
 */
const guidesWithSetupPrelude: ReadonlySet<string> = new Set(['toast', 'toggle-tip', 'tooltip']);

/**
 * Second-level headings that continue a guide's Usage area instead of starting
 * its detail sections, keyed by the guide's slug.
 */
const usageHeadingsByGuide: Readonly<Record<string, readonly string[]>> = {
  carousel: ['Shortcuts'],
  checkbox: ['Shortcuts'],
  'code-block': ['Adapters'],
  'color-picker': ['Shortcuts'],
  'date-input': ['Shortcuts', 'Date Value'],
  'date-picker': ['Date Value'],
  'file-upload': ['Shortcuts'],
  'floating-panel': ['Shortcuts'],
  'hover-card': ['Shortcuts'],
  'number-input': ['Shortcuts'],
  pagination: ['Shortcuts'],
  popover: ['Shortcuts'],
  rating: ['Shortcuts'],
  'segmented-control': ['Shortcuts'],
  slider: ['Shortcuts'],
  splitter: ['Shortcuts'],
  switch: ['Shortcuts'],
  'tags-input': ['Shortcuts'],
  'tree-view': ['Shortcuts'],
};

/** Find where the guide's detail sections begin, skipping fenced code and Usage continuations. */
function detailOffset(body: string, usageHeadings: readonly string[]): number | undefined {
  let offset = 0;
  let fence: '`' | '~' | undefined;
  for (const line of body.split('\n')) {
    const delimiter = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (delimiter) {
      if (!fence) fence = delimiter.startsWith('`') ? '`' : '~';
      else if (delimiter[0] === fence) fence = undefined;
    } else if (!fence) {
      const heading = /^## (?!#)(.*)/.exec(line)?.[1]?.trimEnd();
      if (heading !== undefined && !usageHeadings.includes(heading)) return offset;
    }
    offset += line.length + 1;
  }
  return undefined;
}

/** Written sections listed under Examples, after the live examples. */
const examplesTailHeadings: Readonly<Record<string, readonly string[]>> = {
  toast: [
    'Maximum Visible Toasts',
    'Placement',
    'Overlapping Toasts',
    'Page Idle Behavior',
    'Offset',
  ],
};

/**
 * Move the leading written sections that belong under Examples, such as Closed Component,
 * into the Examples area one level down.
 */
function splitExamplesTail(detail: string, slug: string): { tail: string; rest: string } {
  const names = ['Closed Component', ...(examplesTailHeadings[slug] ?? [])];
  const sections: string[] = [];
  let rest = detail;
  for (;;) {
    const heading = /^## (.*)\s*\n/.exec(rest);
    const title = heading?.[1]?.trim();
    if (!heading || !title || !names.includes(title)) break;
    const after = rest.slice(heading[0].length);
    const next = detailOffset(after, []);
    sections.push(`### ${title}\n\n${(next === undefined ? after : after.slice(0, next)).trim()}`);
    rest = next === undefined ? '' : after.slice(next).trimStart();
  }
  return { tail: sections.join('\n\n'), rest };
}

/** Keep all Usage prose and code before the first following guide section. */
export function splitGuideBody(
  markdown: string,
  slug: string,
): {
  prelude: string;
  intro: string;
  examplesTail: string;
  detail: string;
} {
  const whole = guideBody(markdown, true);
  const usage = /^## Usage\s*$/m.exec(whole);
  const hasPrelude = usage && guidesWithSetupPrelude.has(slug);
  const prelude = hasPrelude ? whole.slice(0, usage.index).trimEnd() : '';
  const body = hasPrelude ? whole.slice(usage.index + usage[0].length).trimStart() : whole;
  const offset = detailOffset(body, usageHeadingsByGuide[slug] ?? []);
  if (offset === undefined) return { prelude, intro: body, examplesTail: '', detail: '' };
  const { tail, rest } = splitExamplesTail(body.slice(offset).trimStart(), slug);
  return { prelude, intro: body.slice(0, offset).trimEnd(), examplesTail: tail, detail: rest };
}
