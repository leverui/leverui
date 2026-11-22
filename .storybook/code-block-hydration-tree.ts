import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  CodeBlockCode as CodeExport,
  CodeBlockCodeText as CodeTextExport,
  CodeBlockCollapseTrigger as CollapseTriggerExport,
  CodeBlockContent as ContentExport,
  CodeBlockPropsProvider as PropsProviderExport,
  CodeBlockRoot as RootExport,
} from '../src';

export interface CodeBlockHydrationComponents {
  CodeBlockRoot: typeof RootExport;
  CodeBlockContent: typeof ContentExport;
  CodeBlockCode: typeof CodeExport;
  CodeBlockCodeText: typeof CodeTextExport;
  CodeBlockCollapseTrigger: typeof CollapseTriggerExport;
  CodeBlockPropsProvider: typeof PropsProviderExport;
}

const initialSize = { base: 'sm', md: 'lg' } as const;
const alternateSize = { base: 'md', md: 'sm' } as const;

/** Build identical native Code Block markup on server and browser. */
export function renderCodeBlockHydrationTree({
  CodeBlockRoot,
  CodeBlockContent,
  CodeBlockCode,
  CodeBlockCodeText,
  CodeBlockCollapseTrigger,
  CodeBlockPropsProvider,
}: CodeBlockHydrationComponents): JSX.Element {
  const [extended, setExtended] = createSignal(false);

  /** Change source after hydration without replacing its native code node. */
  function toggleSource(): void {
    setExtended(!extended());
  }

  return [
    createComponent(CodeBlockPropsProvider, {
      value: { as: 'section', title: 'Hydrated shared code' },
      /** Apply inherited native root defaults before rendering its parts. */
      get children() {
        return createComponent(CodeBlockRoot, {
          /** Follow viewport width and the post-hydration size update. */
          get size() {
            return extended() ? alternateSize : initialSize;
          },
          /** Keep the source reactive after browser hydration. */
          get code() {
            return extended() ? 'one\ntwo\nthree' : 'one';
          },
          maxLines: 2,
          contentId: 'hydrated-code-block-content',
          id: 'hydrated-code-block',
          /** Construct compound parts beneath the active root context. */
          get children() {
            return [
              createComponent(CodeBlockCollapseTrigger, {
                id: 'hydrated-code-block-collapse',
                'aria-label': 'Toggle hydrated code',
                children: 'Toggle code',
              }),
              createComponent(CodeBlockContent, {
                /** Render a native pre and code pair. */
                get children() {
                  return createComponent(CodeBlockCode, {
                    /** Preserve one code node across the source update. */
                    get children() {
                      return createComponent(CodeBlockCodeText, {
                        id: 'hydrated-code-block-code',
                      });
                    },
                  });
                },
              }),
            ];
          },
        });
      },
    }),
    createComponent(CodeBlockRoot, {
      code: 'const custom = true',
      id: 'hydrated-custom-code-block',
      style: { 'border-width': '4px' },
      /** Render the native style through the same native part tree. */
      get children() {
        return createComponent(CodeBlockContent, {
          /** Preserve native pre and code markup during hydration. */
          get children() {
            return createComponent(CodeBlockCode, {
              /** Give the native pre element a local font size. */
              style: { 'font-size': '19px' },
              /** Keep the code node inside the native pre element. */
              get children() {
                return createComponent(CodeBlockCodeText, {
                  id: 'hydrated-custom-code-block-code',
                });
              },
            });
          },
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'code-block-hydration-toggle',
      type: 'button',
      onClick: toggleSource,
      children: 'Toggle source',
    }),
  ];
}
