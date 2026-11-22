export const languageTabs = [
  { title: 'Python', language: 'python', code: "print('Hello, World!')" },
  { title: 'TypeScript', language: 'typescript', code: "console.log('Hello, World!')" },
  { title: 'Java', language: 'java', code: "System.out.println('Hello, World!');" },
] as const;

export type TabLanguage = (typeof languageTabs)[number]['language'];

/** Accept only a language represented by the tabs example. */
export function isTabLanguage(value: string | null): value is TabLanguage {
  return languageTabs.some(
    /** Compare against one supported language key. */
    (file) => file.language === value,
  );
}

export const installTabs = [
  { title: 'npm', language: 'bash', code: 'npm install @leverui/components' },
  { title: 'yarn', language: 'bash', code: 'yarn add @leverui/components' },
  { title: 'bun', language: 'bash', code: 'bun install @leverui/components' },
] as const;

export type PackageManager = (typeof installTabs)[number]['title'];

/** Accept only a package manager represented by the synced tabs. */
export function isPackageManager(value: string | null): value is PackageManager {
  return installTabs.some(
    /** Compare against one supported package manager. */
    (file) => file.title === value,
  );
}
