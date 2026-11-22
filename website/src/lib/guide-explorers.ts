import { type Component } from 'solid-js';
import { collectionGuideExplorers } from './guide-explorers-collections';
import { disclosureGuideExplorers } from './guide-explorers-disclosure';
import { displayGuideExplorers } from './guide-explorers-display';
import { formChoiceGuideExplorers } from './guide-explorers-form-choices';
import { formEntryGuideExplorers } from './guide-explorers-form-entries';

/** One component guide's anatomy explorer. */
export interface GuideExplorerConfig {
  readonly name: string;
  readonly parts: readonly string[];
  /** Part selectors for components that do not use the `__part` class pattern. */
  readonly selectors?: Readonly<Record<string, string>>;
  readonly Demo: Component;
}

/** Explorers that share the generic part highlighter, keyed by guide slug. */
export const guideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  ...collectionGuideExplorers,
  ...disclosureGuideExplorers,
  ...displayGuideExplorers,
  ...formChoiceGuideExplorers,
  ...formEntryGuideExplorers,
};
