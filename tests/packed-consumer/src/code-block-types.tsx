import {
  CodeBlock,
  createShikiAdapter,
  type CodeBlockRootProps,
  type CodeBlockContentProps,
  type CodeBlockCodeTextProps,
  type CodeBlockAdapter,
  type ShikiAdapterOptions,
} from '@leverui/components';
import type { Highlighter } from 'shiki';
import { type JSX } from '@solidjs/web';
import type * as PublicApi from '@leverui/components';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type PublicModule = typeof PublicApi;

export type CodeBlockLargeAccepted = ExpectTrue<
  Assignable<{ code: string; size: 'lg'; children: JSX.Element }, CodeBlockRootProps>
>;
export type CodeBlockExtraLargeRejected = ExpectFalse<
  Assignable<{ code: string; size: 'xl'; children: JSX.Element }, CodeBlockRootProps>
>;
export type CodeBlockUnknownSizeRejected = ExpectFalse<
  Assignable<{ code: string; size: 'giant'; children: JSX.Element }, CodeBlockRootProps>
>;
export type CodeBlockStylesHookRemoved = ExpectFalse<
  'useCodeBlockStyles' extends keyof PublicModule ? true : false
>;
export type CodeBlockRecipeRemoved = ExpectFalse<
  'recipe' extends keyof CodeBlockRootProps ? true : false
>;
export type CodeBlockObjectCssRemoved = ExpectFalse<
  'css' extends keyof CodeBlockContentProps ? true : false
>;
export type CodeBlockStylePropsRemoved = ExpectFalse<
  'bg' extends keyof CodeBlockContentProps ? true : false
>;
export type CodeBlockNativeHooksAccepted = ExpectTrue<
  Assignable<{ class: string; style: string }, CodeBlockContentProps>
>;
export type CodeBlockSvgRefAccepted = ExpectTrue<
  Assignable<{ as: 'svg'; ref: (element: Element) => void }, CodeBlockCodeTextProps>
>;
export type CodeBlockHtmlOnlySvgRefRejected = ExpectFalse<
  Assignable<{ as: 'svg'; ref: (element: HTMLElement) => void }, CodeBlockCodeTextProps>
>;
export type CodeBlockContentIdReserved = ExpectFalse<
  'id' extends keyof CodeBlockContentProps ? true : false
>;
type ShikiOptions = NonNullable<ShikiAdapterOptions<Highlighter>['highlightOptions']>;
export type ShikiValidOptionAccepted = ExpectTrue<
  Assignable<{ mergeWhitespaces: 'never' }, ShikiOptions>
>;
export type ShikiInvalidOptionRejected = ExpectFalse<
  Assignable<{ mergeWhitespaces: 123 }, ShikiOptions>
>;

/** Compile a real Shiki highlighter against the installed adapter factory. */
export function typedShikiAdapter(load: () => Promise<Highlighter>): CodeBlockAdapter {
  return createShikiAdapter<Highlighter>({
    load,
    theme: 'github-dark',
    highlightOptions: { mergeWhitespaces: 'never' },
  });
}

const adapter: CodeBlockAdapter = {
  /** Return plain source from the installed adapter contract. */
  getHighlighter() {
    /** Mark the current source as unhighlighted. */
    function highlight({ code }: { code: string }): { code: string; highlighted: false } {
      return { code, highlighted: false };
    }
    return highlight;
  },
};

/** Compile the installed Code Block namespace, parts, adapter, and finite size. */
export function typedCodeBlock(): JSX.Element {
  return (
    <CodeBlock.AdapterProvider value={adapter}>
      <CodeBlock.Root code="const ready = true" size="lg">
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
}
