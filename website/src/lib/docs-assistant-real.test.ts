import { describe, expect, it } from 'vitest';
import { assistantCases, misspellingCases, type AssistantCase } from './docs-assistant-cases';
import { answerQuestion, createDocsIndex } from './docs-assistant';
import { guides } from './docs';

const index = createDocsIndex(guides);

/** Describe how an answer misses its case, or return nothing when it matches. */
function miss(test: AssistantCase): string | undefined {
  const answer = answerQuestion(index, test.question);
  const titles = answer.links.map(
    /** Read one link's title. */
    (link) => link.title,
  );
  const got = `${answer.kind} [${titles.join(', ')}]`;
  if (answer.kind !== test.kind) return `${test.question} → ${got}, expected ${test.kind}`;
  const anyPage =
    !test.pages ||
    test.pages.some(
      /** Check one acceptable page. */
      (page) => titles.includes(page),
    );
  const allPages = (test.allPages ?? []).every(
    /** Check one required page. */
    (page) => titles.includes(page),
  );
  if (!anyPage || !allPages) {
    return `${test.question} → ${got}, expected ${[...(test.pages ?? []), ...(test.allPages ?? [])].join(' / ')}`;
  }
  return undefined;
}

describe('docs assistant on the real docs', () => {
  it('has a hundred cases', () => {
    expect(assistantCases).toHaveLength(100);
  });

  it('answers every case as expected', () => {
    const misses = [...assistantCases, ...misspellingCases].map(miss).filter(
      /** Keep the cases that missed. */
      (result): result is string => result !== undefined,
    );
    expect(misses).toEqual([]);
  });
});
