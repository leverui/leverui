export type CodeLanguage = 'typescript' | 'python';

export const codeFiles = {
  typescript: {
    title: 'example.ts',
    code: 'const ready = true\nconsole.log(ready)',
  },
  python: {
    title: 'example.py',
    code: 'ready = True\nprint(ready)',
  },
} as const;

export const codeTabsStorageKey = 'leverui-code-block-language';

/** Accept only languages represented by the composition samples. */
export function isCodeLanguage(value: string | null): value is CodeLanguage {
  return value === 'typescript' || value === 'python';
}
