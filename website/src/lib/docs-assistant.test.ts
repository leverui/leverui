import { describe, expect, it } from 'vitest';
import type { Guide } from './docs';
import { answerQuestion, createDocsIndex } from './docs-assistant';

/** Make a small guide for the index. */
function guide(title: string, path: string, content: string): Guide {
  return { title, path, content, summary: content.slice(0, 60), kind: 'component' };
}

const index = createDocsIndex([
  guide('Dialog', '/docs/components/dialog', 'A window over the page. Write your own content.'),
  guide('Date Picker', '/docs/components/date-picker', 'Pick a date from a calendar grid.'),
  guide('Color Mode', '/docs/components/concepts/color-mode', 'Switch between light and dark.'),
  guide(
    'Installation',
    '/docs/getting-started',
    'Install the package and import the stylesheet. Set up TypeScript for JSX.',
  ),
  guide('Card', '/docs/components/card', 'A box for content. Fix its width at any time.'),
  guide('Timeline', '/docs/components/timeline', 'Events listed in time order.'),
  guide('Heading', '/docs/components/heading', 'A title for a section of the page.'),
  guide('Spinner', '/docs/components/spinner', 'Shows that something is loading.'),
  guide('Testing', '/docs/components/concepts/testing', 'Write tests with your test runner.'),
  guide('Overview', '/docs/components/concepts/overview', 'Every component, with a demo.'),
  guide('Radius variables', '/docs/theme-variables/radii', 'Rounded corners for every surface.'),
]);

/** The titles of the pages an answer links. */
function titles(question: string): readonly string[] {
  return answerQuestion(index, question).links.map(
    /** Read one link's title. */
    (link) => link.title,
  );
}

/** Report whether a question gets the off-topic or about-the-assistant reply. */
function turnedAway(question: string): boolean {
  const answer = answerQuestion(index, question);
  return answer.links.length === 0 && answer.suggest === true;
}

describe('answerQuestion', () => {
  it('answers questions that name a page, in everyday words or with typos', () => {
    expect(titles('Is there a date picker?')[0]).toBe('Date Picker');
    expect(titles('how do I open a modal')[0]).toBe('Dialog');
    expect(titles('dailog')[0]).toBe('Dialog');
    expect(titles('does it support dark mode')[0]).toBe('Color Mode');
  });

  it('answers questions that a page covers in its text', () => {
    expect(titles('rounded corners')[0]).toBe('Radius variables');
  });

  it('answers a question about a docs topic that is not a page title', () => {
    expect(titles('does it work with typescript')[0]).toBe('Installation');
  });

  it('still answers a question about Lever UI that is put to the assistant', () => {
    expect(titles('can you show me the dialog')[0]).toBe('Dialog');
  });

  it('describes itself when a question is about the assistant, not Lever UI', () => {
    for (const question of ['are you a person?', 'who built you', 'is this an AI bot']) {
      const answer = answerQuestion(index, question);
      expect(answer.text).toMatch(/not an AI model/);
      expect(answer.suggest).toBe(true);
    }
  });

  it('turns away questions that are not about Lever UI', () => {
    for (const question of [
      'what is the capital of France',
      'tell me a joke',
      'write me a poem',
      'best pizza near here',
    ]) {
      expect(turnedAway(question)).toBe(true);
    }
  });

  it('does not let one common word make a question on topic', () => {
    // "Write" appears in two guides, but nothing covers the rest of the question.
    expect(turnedAway('write a song about the sea')).toBe(true);
    // "Time" appears in page text, but one common word is not enough.
    expect(turnedAway('what time is it')).toBe(true);
  });

  it('does not match a short word to a longer title word', () => {
    // "car" is not "Card", though it is one letter short of it.
    expect(turnedAway('how do I fix my car')).toBe(true);
    expect(titles('cards')[0]).toBe('Card');
    // Two letters off a title word is a different word unless the word is long.
    expect(turnedAway('what is the meaning of life')).toBe(true);
    expect(turnedAway('where should I eat dinner')).toBe(true);
  });

  it('says what is here when a question names nothing specific', () => {
    for (const question of ['What do you have?', 'what components are there', 'can you help me']) {
      const answer = answerQuestion(index, question);
      expect(answer.text).toMatch(/components, charts, and hooks/);
      expect(answer.links.map((link) => link.title)).toContain('Overview');
    }
  });

  it('keeps its fixed replies', () => {
    expect(answerQuestion(index, 'hello').text).toMatch(/^Hi!/);
    expect(answerQuestion(index, 'thanks!').text).toMatch(/welcome/);
    expect(titles('what is lever ui')).toEqual(['Installation', 'Overview']);
  });
});
