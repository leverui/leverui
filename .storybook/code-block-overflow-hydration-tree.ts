import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { CodeBlock, createHighlightJsAdapter } from '../src';
import overflowData from './code-block-overflow-data.json' with { type: 'json' };
import { createOverflowHydrationAdapter } from './code-block-overflow-hydration-adapter';

export interface OverflowHydrationComponents {
  CodeBlock: typeof CodeBlock;
  createHighlightJsAdapter: typeof createHighlightJsAdapter;
}

/** Build identical long-line Code Block markup for SSR and hydration. */
export function renderOverflowHydrationTree(parts: OverflowHydrationComponents): JSX.Element {
  const adapter = createOverflowHydrationAdapter(parts.createHighlightJsAdapter);
  const [wrapped, setWrapped] = createSignal(false);
  const [tag, setTag] = createSignal<'code' | 'span' | 'svg'>('code');

  /** Change only wrapping metadata on the mounted highlighted source. */
  function toggleWrap(): void {
    setWrapped(!wrapped());
  }

  /** Exercise the public polymorphic tag after attaching to server markup. */
  function changeTag(): void {
    setTag(tag() === 'code' ? 'span' : 'svg');
  }

  /** Confirm the public code-part ref reaches the retained native element. */
  function captureCode(element: Element): void {
    element.setAttribute('data-consumer-ref', 'true');
  }

  return createComponent(parts.CodeBlock.AdapterProvider, {
    value: adapter,
    /** Render one control and the numbered long-source block. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          type: 'button',
          id: 'overflow-hydration-toggle',
          onClick: toggleWrap,
          children: 'Toggle wrapping',
        }),
        createComponent(Dynamic, {
          component: 'button',
          type: 'button',
          id: 'overflow-hydration-tag',
          onClick: changeTag,
          children: 'Change code tag',
        }),
        createComponent(parts.CodeBlock.Root, {
          code: overflowData.source,
          language: 'tsx',
          /** Recompute line metadata without replacing native nodes. */
          get meta() {
            return { showLineNumbers: true, wordWrap: wrapped() };
          },
          style: { width: '320px' },
          id: 'overflow-hydration-root',
          /** Render native code parts within the root context. */
          get children() {
            return createComponent(parts.CodeBlock.Content, {
              /** Keep the focusable scroll viewport in the source tree. */
              get children() {
                return createComponent(parts.CodeBlock.Code, {
                  id: 'overflow-hydration-pre',
                  /** Render highlighted line wrappers inside one native code element. */
                  get children() {
                    return createComponent(parts.CodeBlock.CodeText, {
                      id: 'overflow-hydration-code',
                      ref: captureCode,
                      /** Keep the source content while replacing its native tag. */
                      get as() {
                        return tag();
                      },
                    });
                  },
                });
              },
            });
          },
        }),
      ];
    },
  });
}
