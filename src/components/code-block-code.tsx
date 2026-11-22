import { splitProps } from '../primitives/utils/split-props';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { primitive } from '../primitives/components/factory';
import type { GetChildProps } from '../styled-system/child-props';
import { CodeBlockHydratableCode } from './code-block-hydratable-code';
import { primitiveChildWithRef } from './primitive-child';
import { useCodeBlockHighlighter } from './code-block-adapter-provider';
import { useCodeBlockPartStyle } from './code-block-part-style';
import type { CodeBlockCodeProps, CodeBlockCodeTextProps } from './code-block-props';
import { useCodeBlockContext } from './code-block-state';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape unhighlighted source before assigning it as code element HTML. */
function escapeCode(code: string): string {
  return code.replace(
    /[&<>"']/g,
    /** Look up the safe HTML entity for one source character. */
    (character) => htmlEntities[character] ?? character,
  );
}

/** Render the scrollable, keyboard-focusable native pre element. */
export function CodeBlockCode(props: CodeBlockCodeProps): JSX.Element {
  const [local, rest] = splitProps(props, ['class', 'className', 'unstyled']);
  const style = useCodeBlockPartStyle('code', local);
  return (
    <primitive.pre
      tabindex={0}
      {...rest}
      class={style.className()}
      data-unstyled={style.unstyled()}
    />
  );
}

/* eslint-disable solid/no-innerhtml -- Adapter markup is trusted; plain source is escaped above. */
/** Render readable source or trusted syntax markup inside native code. */
export function CodeBlockCodeText(props: CodeBlockCodeTextProps): JSX.Element {
  const state = useCodeBlockContext();
  const highlighter = useCodeBlockHighlighter();
  const [local, rest] = splitProps(props, [
    'class',
    'className',
    'unstyled',
    'children',
    'as',
    'asChild',
    'ref',
  ]);
  const style = useCodeBlockPartStyle('codeText', local);
  const highlighted = createMemo(
    /** Re-highlight when source, language, metadata, or the adapter changes. */
    () => highlighter()({ code: state.code(), language: state.language(), meta: state.meta() }),
  );
  const html = createMemo(
    /** Supply trusted syntax HTML or escaped plain source. */
    () => (highlighted().highlighted ? highlighted().code : escapeCode(state.code())),
  );

  /** Keep server-rendered syntax nodes when hydrating the native code element. */
  function renderNativeCode(getProps: GetChildProps): JSX.Element {
    return <CodeBlockHydratableCode tag={local.as ?? 'code'} getProps={getProps} />;
  }
  /** Deliver the consumer ref to the retained native code element. */
  function readRef(): unknown {
    return local.ref;
  }

  return (
    <primitive.code
      {...rest}
      asChild={primitiveChildWithRef(local.asChild ?? renderNativeCode, readRef)}
      data-plaintext={highlighted().highlighted ? undefined : ''}
      data-has-focused={state.meta().focusedLineNumbers?.length ? '' : undefined}
      data-has-diff={
        state.meta().addedLineNumbers?.length || state.meta().removedLineNumbers?.length
          ? ''
          : undefined
      }
      data-has-line-numbers={state.meta().showLineNumbers ? '' : undefined}
      data-word-wrap={state.meta().wordWrap ? '' : undefined}
      class={style.className()}
      data-unstyled={style.unstyled()}
      innerHTML={html()}
    />
  );
}
/* eslint-enable solid/no-innerhtml */
