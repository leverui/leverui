const guidesWithoutIntroExample = new Set(['overlay-manager']);

/** Count the leading stories shown above Usage instead of under Examples. */
export function guideIntroStoryCount(slug: string): number {
  return guidesWithoutIntroExample.has(slug) ? 0 : 1;
}
