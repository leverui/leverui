import type { GuideExampleMap } from './types';

/** Internationalization guides' example sequence, headings, and Storybook-only omissions. */
export const internationalizationGuideExamples: GuideExampleMap = {
  'format-byte': [
    { id: 'Basic' },
    { id: 'Sizes' },
    { id: 'FormatBits', title: 'Format Bits' },
    { id: 'Locale' },
    { id: 'UnitDisplay', title: 'Unit Display' },
  ],
  'format-number': [
    { id: 'Basic' },
    { id: 'Percentage' },
    { id: 'Currency' },
    { id: 'Locale' },
    { id: 'Unit' },
    { id: 'CompactNotation', title: 'Compact Notation' },
  ],
};
