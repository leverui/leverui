import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { TagCloseTrigger as CloseExport } from '../src/components/tag-close-trigger';
import type {
  TagEndElement as EndExport,
  TagLabel as LabelExport,
} from '../src/components/tag-parts';
import type { TagRootPropsProvider as PropsProviderExport } from '../src/components/tag-props';
import type { TagRoot as RootExport } from '../src/components/tag-root';

export interface TagHydrationComponents {
  TagRootPropsProvider: typeof PropsProviderExport;
  TagRoot: typeof RootExport;
  TagLabel: typeof LabelExport;
  TagEndElement: typeof EndExport;
  TagCloseTrigger: typeof CloseExport;
}

/** Build matching server and browser Tag trees with live size and close state. */
export function renderTagHydrationTree(components: TagHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [closes, setCloses] = createSignal(0);

  /** Change inherited CSS size after hydration. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Count keyboard or pointer close activations after hydration. */
  function closeTag(): void {
    setCloses(closes() + 1);
  }

  return createComponent(components.TagRootPropsProvider, {
    /** Follow changes through the reactive root props provider. */
    value: () => ({ size: large() ? 'xl' : 'sm' }),
    /** Construct the Tag and native controls under one provider. */
    get children() {
      return [
        createComponent(components.TagRoot, {
          id: 'hydrated-tag',
          /** Construct the native parts after the root style context. */
          get children() {
            return [
              createComponent(components.TagLabel, {
                id: 'hydrated-tag-label',
                children: 'Hydrated tag',
              }),
              createComponent(components.TagEndElement, {
                /** Keep the close button in its end-element slot. */
                get children() {
                  return createComponent(components.TagCloseTrigger, {
                    id: 'hydrated-tag-close',
                    onClick: closeTag,
                  });
                },
              }),
            ];
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'tag-hydration-toggle',
          type: 'button',
          onClick: toggleSize,
          children: 'Toggle Tag size',
        }),
        createComponent(Dynamic, {
          component: 'output',
          id: 'tag-hydration-closes',
          /** Render live close count without replacing the native output. */
          get children() {
            return closes();
          },
        }),
      ];
    },
  });
}
