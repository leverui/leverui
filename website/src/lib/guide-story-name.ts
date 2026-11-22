import { guideExampleEntries } from './guide-examples';

/** Turn a Storybook export name into a readable example heading. */
export function storyName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/** Use a guide heading without renaming its Storybook export. */
export function guideStoryName(slug: string, id: string, fallback: string): string {
  const entry = guideExampleEntries(slug).find(
    /** Select the entry attached to this Storybook export. */
    (item) => item.id === id,
  );
  return entry?.title ?? fallback;
}
