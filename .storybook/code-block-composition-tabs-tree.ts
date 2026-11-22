import { createComponent, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  CodeBlockCode,
  CodeBlockCodeText,
  CodeBlockContent,
  CodeBlockCopyIndicator,
  CodeBlockCopyTrigger,
  CodeBlockHeader,
  CodeBlockRoot,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '../src';
import { codeFiles, codeTabsStorageKey, type CodeLanguage } from './code-block-composition-data';
import { useSyncedCodeLanguage, type SyncedCodeLanguage } from './code-block-composition-sync';

export interface CodeTabsComponents {
  CodeBlockRoot: typeof CodeBlockRoot;
  CodeBlockHeader: typeof CodeBlockHeader;
  CodeBlockCopyTrigger: typeof CodeBlockCopyTrigger;
  CodeBlockCopyIndicator: typeof CodeBlockCopyIndicator;
  CodeBlockContent: typeof CodeBlockContent;
  CodeBlockCode: typeof CodeBlockCode;
  CodeBlockCodeText: typeof CodeBlockCodeText;
  TabsRoot: typeof TabsRoot;
  TabsList: typeof TabsList;
  TabsTrigger: typeof TabsTrigger;
  TabsContent: typeof TabsContent;
}

/** Render one accessible tab trigger for a source language. */
function renderTrigger(
  parts: CodeTabsComponents,
  name: string,
  language: CodeLanguage,
): JSX.Element {
  return createComponent(parts.TabsTrigger, {
    value: language,
    'data-testid': `${name}-${language}-tab`,
    children: language === 'typescript' ? 'TypeScript' : 'Python',
  });
}

/** Keep inactive panels registered without duplicating the active code surface. */
function renderPanel(
  parts: CodeTabsComponents,
  name: string,
  language: CodeLanguage,
  selection: SyncedCodeLanguage,
): JSX.Element {
  return createComponent(parts.TabsContent, {
    value: language,
    'data-testid': `${name}-${language}-panel`,
    /** Mount native code only in the selected panel. */
    get children() {
      return Show({
        /** Follow the controlled tab selection. */
        get when() {
          return selection.value() === language;
        },
        /** Let Code Block write highlighted or escaped source. */
        get children() {
          return createComponent(parts.CodeBlockCode, {
            /** Render the code text beneath the active panel. */
            get children() {
              return createComponent(parts.CodeBlockCodeText, {
                id: `${name}-${language}-code`,
              });
            },
          });
        },
      });
    },
  });
}

/** Place tab selection and copy in one Code Block header. */
function renderHeader(parts: CodeTabsComponents, name: string): JSX.Element {
  return createComponent(parts.CodeBlockHeader, {
    /** Keep controls in the active Code Block's context. */
    get children() {
      return [
        createComponent(parts.TabsList, {
          'aria-label': `${name} code language`,
          /** Offer both languages to keyboard and pointer users. */
          get children() {
            return [renderTrigger(parts, name, 'typescript'), renderTrigger(parts, name, 'python')];
          },
        }),
        createComponent(parts.CodeBlockCopyTrigger, {
          'aria-label': `Copy ${name} code`,
          'data-testid': `${name}-copy`,
          /** Expose the copy state inside the native button. */
          get children() {
            return createComponent(parts.CodeBlockCopyIndicator, {});
          },
        }),
      ];
    },
  });
}

/** Keep both tab panels attached to one reactive Code Block root. */
function renderCodeBlock(
  parts: CodeTabsComponents,
  name: string,
  selection: SyncedCodeLanguage,
): JSX.Element {
  return createComponent(parts.CodeBlockRoot, {
    /** Update the displayed and copied source without replacing the root. */
    get code() {
      return codeFiles[selection.value()].code;
    },
    /** Highlight the selected source with its matching language. */
    get language() {
      return selection.value();
    },
    'data-testid': `${name}-code-block`,
    /** Compose all parts beneath one Code Block context. */
    get children() {
      return [
        renderHeader(parts, name),
        createComponent(parts.CodeBlockContent, {
          /** Keep both panels registered with the primitive's Tabs machine. */
          get children() {
            return [
              renderPanel(parts, name, 'typescript', selection),
              renderPanel(parts, name, 'python', selection),
            ];
          },
        }),
      ];
    },
  });
}

/** Build the same synchronized Code Block tree for Storybook and published SSR. */
export function renderSyncedCodeTabs(parts: CodeTabsComponents, name: string): JSX.Element {
  const selection = useSyncedCodeLanguage(codeTabsStorageKey);
  return createComponent(parts.TabsRoot, {
    /** Follow local clicks and changes from other groups or browser tabs. */
    get value() {
      return selection.value();
    },
    onValueChange: selection.change,
    /** Preserve one Code Block root across tab selections. */
    get children() {
      return renderCodeBlock(parts, name, selection);
    },
  });
}
