import { type JSX } from '@solidjs/web';

/** A Storybook example rendered inside a component guide. */
export interface GuideStory {
  readonly id: string;
  readonly name: string;
  readonly render: () => JSX.Element;
  readonly decorated: boolean;
  readonly outerInset: boolean;
  readonly selfPadded: boolean;
  readonly naturalHeight: boolean;
  readonly code: string | undefined;
  readonly heading: boolean;
  readonly subheading: string | undefined;
  readonly description: string | undefined;
  /** Render the description as Markdown, set by the story's `descriptionFormat`. */
  readonly descriptionMarkdown: boolean;
  /** A Markdown note shown above the example, under its description. */
  readonly note: string | undefined;
  readonly after: string | undefined;
  readonly sourceFile: string | undefined;
}
