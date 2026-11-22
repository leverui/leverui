import { describe, expect, it } from 'vitest';
import { actionBarAnatomy, accordionAnatomy, datePickerAnatomy } from './anatomy';

/** Keep local parts and the primitive extensions available through the anatomy barrel. */
function preservesAnatomyParts(): void {
  expect(actionBarAnatomy.keys()).toEqual([
    'positioner',
    'content',
    'separator',
    'selectionTrigger',
    'closeTrigger',
  ]);
  expect(accordionAnatomy.keys()).toContain('itemBody');
  expect(datePickerAnatomy.keys()).toContain('indicatorGroup');
}

describe('anatomy modules', () => {
  it('preserves local and primitive-backed parts', preservesAnatomyParts);
});
