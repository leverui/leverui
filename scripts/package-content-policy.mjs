const excludedDirectories = new Set([
  '.storybook',
  '__snapshots__',
  '__stories__',
  '__tests__',
  'stories',
  'story',
  'storybook',
  'tests',
  'test',
]);
const excludedFilename = /\.(?:test|spec|stories)\.[^/]+$/;

/** Identify test and story artifacts that must never enter the package. */
export function isExcludedPackagePath(path) {
  for (const segment of path.split('/')) {
    if (excludedDirectories.has(segment) || excludedFilename.test(segment)) return true;
  }
  return false;
}
