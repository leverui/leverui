/**
 * A hundred hard questions for the docs assistant, with the answer each should get. They run
 * against the real docs in `docs-assistant-real.test.ts`. A case names the kind of reply, and
 * for a docs answer, pages that should appear among the links (any one, or all of `allPages`).
 */
import type { AnswerKind } from './docs-assistant';

/** One question and the answer it should get. */
export interface AssistantCase {
  readonly question: string;
  readonly kind: AnswerKind;
  /** For a docs answer: at least one of these pages should be linked. */
  readonly pages?: readonly string[];
  /** For a docs answer: every one of these pages should be linked. */
  readonly allPages?: readonly string[];
}

/** A docs answer that should link one of these pages. */
function docs(question: string, ...pages: string[]): AssistantCase {
  return { question, kind: 'docs', pages };
}

/** A reply of a given kind, with no particular page. */
function reply(kind: AnswerKind, ...questions: string[]): AssistantCase[] {
  return questions.map(
    /** Pair one question with the expected kind. */
    (question) => ({ question, kind }),
  );
}

const longRamble =
  'So I have been building this settings page all week and my manager keeps asking for ' +
  'little explanations next to each option, so how do I show a tooltip on hover?';

export const assistantCases: readonly AssistantCase[] = [
  // Everyday words for components.
  docs('how do I show a popup window', 'Dialog', 'Popover'),
  docs('I need a dropdown to pick a country', 'Select', 'Combobox', 'Select (Native)'),
  docs('something to show a loading state', 'Skeleton', 'Spinner', 'Progress'),
  docs('a toggle for settings', 'Switch'),
  docs('show a notification after saving', 'Toast'),
  docs('star rating', 'Rating'),
  docs('breadcrumbs for navigation', 'Breadcrumb'),
  docs('upload an image', 'File Upload'),
  docs('a little hint when hovering an icon', 'Tooltip', 'Toggle Tip', 'Hover Card'),
  docs('side panel that slides in', 'Drawer'),
  docs('progress bar', 'Progress'),
  docs('copy to clipboard button', 'Clipboard'),
  docs('number stepper', 'Number Input'),
  docs('multi select with chips', 'Tags Input', 'Combobox', 'Select'),
  docs('keyboard shortcut hint', 'Kbd'),

  // Typos, slang, and capitals.
  docs('dailog', 'Dialog'),
  docs('accordian', 'Accordion'),
  docs('tooltp', 'Tooltip'),
  docs('carosel', 'Carousel'),
  docs('chekbox', 'Checkbox'),
  docs('HOW DO I USE TABS', 'Tabs'),
  docs('datepicker', 'Date Picker'),
  docs('colorpicker pls', 'Color Picker'),
  docs('modal plz', 'Dialog'),
  docs('wat is a combobox', 'Combobox'),

  // How-to tasks.
  docs('how do I install lever ui', 'Installation'),
  docs(
    'how do I change the primary color',
    'Colors',
    'Color variables',
    'Customize Lever UI with CSS',
  ),
  docs('can I use my own fonts', 'Customize Lever UI with CSS', 'Font variables'),
  docs('how do I make it responsive', 'Responsive styles'),
  docs('does it support server side rendering', 'Server rendering and hydration'),
  docs('how to theme only part of the page', 'Scoped CSS themes', 'Theme'),
  docs('how do I animate a dialog', 'Animation', 'Dialog'),
  docs('make a bar chart', 'Bar Chart'),
  docs('how do I test components', 'Testing'),
  docs('use it with typescript', 'Installation'),
  docs('how do I compose my own component from parts', 'Composition'),
  docs('right to left support', 'Locale Provider', 'Environment Provider'),
  docs('how do I format a number as currency', 'Format Number'),
  docs('show the file size in KB', 'Format Byte'),
  docs('keyboard navigation in menus', 'Menu', 'Accessibility with Lever UI'),

  // Questions about the project.
  ...reply('license', 'is it free', 'what license is it under', 'can I use it commercially'),
  ...reply('stability', 'is it production ready', 'is this stable', 'what version is it'),
  ...reply('github', 'I found a bug', 'how can I contribute', 'where is the source code'),
  docs('does it work with solid 1', 'Installation'),
  ...reply('value', 'why should I use lever ui', 'is it better than other libraries'),

  // Small talk.
  ...reply('greeting', 'hi', 'good morning!', 'hey there'),
  ...reply('smallTalk', 'how are you', "what's up"),
  ...reply('thanks', 'thanks a lot'),
  ...reply('farewell', 'bye', 'see you later'),
  ...reply('compliment', 'this is awesome'),
  ...reply('acknowledgment', 'cool', 'ok', 'lol'),

  // Questions about the assistant.
  ...reply(
    'about',
    'what model are you',
    'are you a large language model',
    'are you a real person',
    'who made you',
    'do you have feelings',
    "what's your name",
    'are you sentient',
    'can you learn from me',
    'why are you so dumb',
    'is this an AI',
  ),

  // Complaints that do not say "you".
  ...reply('complaint', 'this sucks', 'this is useless', 'that answer was wrong', 'not helpful'),

  // Off topic.
  ...reply(
    'notFound',
    "what's the weather in Tokyo",
    'capital of Australia',
    'how do I bake bread',
    'should I buy stocks',
    'translate good night to French',
    'tell me a joke',
    'write a poem about cats',
    'what is 12 times 7',
    'who won the game last night',
    'recommend a movie',
    'I have a headache',
    'book me a hotel in Paris',
  ),

  // Odd input.
  ...reply('catalog', '?', 'help', 'what else is there'),
  ...reply('acknowledgment', '👍'),
  ...reply('notFound', 'asdfghjkl'),
  docs(longRamble, 'Tooltip'),

  // Code, and more than one topic.
  docs('<Dialog.Root open>', 'Dialog'),
  { question: 'date picker and select', kind: 'docs', allPages: ['Date Picker', 'Select'] },
  { question: "I don't want a modal, I want a drawer", kind: 'docs', allPages: ['Drawer'] },
  docs('what about charts?', 'Charts', 'Bar Chart', 'Line Chart', 'Area Chart', 'Pie Chart'),
];

/**
 * Common misspellings of words the docs use. Each should still find its page, though the
 * misspelling never appears in the docs.
 */
export const misspellingCases: readonly AssistantCase[] = [
  docs('themeing', 'Customize Lever UI with CSS', 'Lever UI theming', 'Theme', 'Scoped CSS themes'),
  docs('seperator', 'Separator'),
  docs('accesibility', 'Accessibility with Lever UI'),
  docs('calender', 'Calendar', 'Date Picker'),
  docs('responsiv styles', 'Responsive styles'),
  docs('tooltipp', 'Tooltip'),
  docs('combo box', 'Combobox'),
  docs('dropdwon', 'Menu', 'Select'),
  docs('notifcation', 'Toast'),
  docs('pagnation', 'Pagination'),
  docs('slidder', 'Slider'),
  docs('checkbx', 'Checkbox'),
  docs('typscript', 'Installation'),
  docs('hydratoin', 'Server rendering and hydration'),
  docs('breadcrum', 'Breadcrumb'),
  docs('swich', 'Switch'),
  docs('avtar', 'Avatar'),
  docs('tost message', 'Toast'),
  docs('tailwnd', 'Tailwind CSS'),
];
