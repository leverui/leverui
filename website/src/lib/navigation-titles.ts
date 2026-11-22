/** Sidebar names that differ from a guide's title, keyed by the guide's slug. */
const navigationTitles: Record<string, string> = {
  'absolute-center': 'Center (Absolute)',
  accessibility: 'Accessibility',
  axes: 'Axis (X and Y)',
  charts: 'Introduction',
  'client-only': 'ClientOnly',
  'custom-systems': 'Scoped themes',
  'download-trigger': 'Download Trigger',
  'environment-provider': 'EnvironmentProvider',
  'format-byte': 'FormatByte',
  'format-number': 'FormatNumber',
  'locale-provider': 'LocaleProvider',
  'native-select': 'Select (Native)',
  'server-rendering': 'Server rendering',
  'theme-guide': 'Customize with CSS',
  'toggle-tip': 'Toggle Tip',
};

/** Keep component names readable in the sidebar. */
export function navigationTitle(path: string, fallback: string): string {
  return navigationTitles[path.split('/').at(-1) ?? ''] ?? fallback;
}
