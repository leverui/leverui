import type { JSX } from '@solidjs/web';

/** Wrap a demo in layout or context; the website and Storybook apply these in order. */
export type DemoDecorator = (demo: () => JSX.Element) => JSX.Element;

/** How the website presents one demo or every demo in a family. */
export interface DemoGuide {
  readonly description?: string | undefined;
  readonly descriptionFormat?: 'markdown' | undefined;
  readonly heading?: boolean | undefined;
  readonly subheading?: string | undefined;
  readonly after?: string | undefined;
  readonly outerInset?: boolean | undefined;
  readonly selfPadded?: boolean | undefined;
  readonly naturalHeight?: boolean | undefined;
}

/** Presentation settings for a demo; `guide` drives the website. */
export interface DemoParameters {
  readonly guide?: DemoGuide | undefined;
}

/** Shared settings for every demo of one component family. */
export interface DemoMeta {
  readonly component?: unknown;
  readonly decorators?: readonly DemoDecorator[] | undefined;
  readonly args?: Readonly<Record<string, unknown>> | undefined;
  readonly parameters?: DemoParameters | undefined;
}

/** One named demo. Storybook re-exports it as a story; the website renders it. */
export interface Demo {
  readonly name?: string | undefined;
  readonly args?: Readonly<Record<string, unknown>> | undefined;
  readonly parameters?: DemoParameters | undefined;
  /** Render the demo; method syntax lets demos declare their own argument types. */
  render?(args: Readonly<Record<string, unknown>>): JSX.Element;
  /** Run an interaction after the demo mounts in Storybook. */
  play?(context: { readonly canvasElement: HTMLElement }): Promise<void> | void;
}
