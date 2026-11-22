/** Guide slugs whose demo family uses a different name. */
const guideStoryAliases: Readonly<Record<string, string>> = {
  calendar: 'date-picker-calendar',
  'overlay-manager': 'overlay',
  'segmented-control': 'segment-group',
};

/** Name the `demos/<name>.tsx` family that backs a guide. */
export function guideStoryFilename(slug: string): string {
  return guideStoryAliases[slug] ?? slug;
}
