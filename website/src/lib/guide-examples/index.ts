import { buttonGuideExamples } from './buttons';
import { collectionGuideExamples } from './collections';
import { dataDisplayGuideExamples } from './data-display';
import { dateTimeGuideExamples } from './date-time';
import { disclosureGuideExamples } from './disclosure';
import { feedbackGuideExamples } from './feedback';
import { formChoiceGuideExamples } from './form-choices';
import { formEntryGuideExamples } from './form-entries';
import { internationalizationGuideExamples } from './internationalization';
import { layoutGuideExamples } from './layout';
import { overlayGuideExamples } from './overlays';
import { typographyGuideExamples } from './typography';
import { utilityGuideExamples } from './utilities';
import type { GuideExample, GuideExampleMap } from './types';

export type { GuideExample, GuideExampleMap } from './types';

/** Every guide's example sequence, grouped in files by the site's guide categories. */
export const guideExamples: GuideExampleMap = {
  ...layoutGuideExamples,
  ...typographyGuideExamples,
  ...buttonGuideExamples,
  ...dateTimeGuideExamples,
  ...formChoiceGuideExamples,
  ...formEntryGuideExamples,
  ...collectionGuideExamples,
  ...overlayGuideExamples,
  ...disclosureGuideExamples,
  ...feedbackGuideExamples,
  ...dataDisplayGuideExamples,
  ...internationalizationGuideExamples,
  ...utilityGuideExamples,
};

/** List one guide's example entries, or none when the guide keeps authored order. */
export function guideExampleEntries(slug: string): readonly GuideExample[] {
  return guideExamples[slug] ?? [];
}
