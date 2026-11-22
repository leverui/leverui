import {
  Highlight,
  Mark,
  MarkPropsProvider,
  type HighlightProps,
  type MarkProps,
  type MarkPropsProviderProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type ProviderDefaults = Exclude<MarkPropsProviderProps['value'], (...args: never[]) => unknown>;

export type HighlightClassAccepted = ExpectTrue<
  'markClass' extends keyof HighlightProps ? true : false
>;
export type HighlightNativeStyleAccepted = ExpectTrue<
  'markStyle' extends keyof HighlightProps ? true : false
>;
export type HighlightStyleObjectRejected = ExpectFalse<
  'styles' extends keyof HighlightProps ? true : false
>;
export type MarkCssObjectRejected = ExpectFalse<'css' extends keyof MarkProps ? true : false>;
export type MarkRecipeRejected = ExpectFalse<'recipe' extends keyof MarkProps ? true : false>;
export type ProviderClassAccepted = ExpectTrue<
  'class' extends keyof ProviderDefaults ? true : false
>;

/** Receive the selected native anchor from a polymorphic Mark. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.markRef = 'anchor';
}

/** Compile the public Mark and Highlight CSS-first props in a fresh consumer. */
export function typedHighlight(): JSX.Element {
  return (
    <MarkPropsProvider value={{ variant: 'solid', class: 'search-match' }}>
      <Mark as="a" href="#match" ref={receiveAnchor}>
        Match link
      </Mark>
      <Highlight query="match" markClass="search-match" markStyle={{ color: 'red' }}>
        Match this text
      </Highlight>
    </MarkPropsProvider>
  );
}
