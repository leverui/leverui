/**
 * Write an `llms.txt` index of the guides: one line per guide with its title, its address,
 * and the first sentence of its first paragraph. The package copy and the website copy both
 * use it, so they describe each guide the same way.
 */

/** Read a guide's title and the first sentence of its first paragraph. */
export function describeGuide(content) {
  const title = /^# (.+)$/m.exec(content)?.[1] ?? '';
  const paragraph = content
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n\s*\n/)
    .map(
      /** Flatten a block to one line. */
      (block) => block.trim().replace(/\s+/g, ' '),
    )
    .find(
      /** Find the first block of plain prose. */
      (block) => block && !/^(#|```|\||-|\*|<|\d+\.)/.test(block),
    );
  const sentence = paragraph?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').match(/^.+?[.!?](?=\s|$)/);
  return { title, summary: sentence?.[0] ?? '' };
}

/** Format the index from an introduction and sections of guides. */
export function formatLlmsIndex(introduction, sections) {
  const lines = [
    '# Lever UI',
    '',
    '> Accessible components for SolidJS 2, with a default CSS theme and server rendering.',
    '',
    introduction,
  ];
  for (const section of sections) {
    lines.push('', `## ${section.title}`, '');
    for (const guide of section.guides) {
      const { title, summary } = describeGuide(guide.content);
      lines.push(`- [${guide.title ?? title}](${guide.href})${summary ? `: ${summary}` : ''}`);
    }
  }
  return `${lines.join('\n')}\n`;
}
