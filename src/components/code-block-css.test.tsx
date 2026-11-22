import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { render, screen } from '@solidjs/testing-library';
import { expect, it } from 'vitest';
import { CodeBlockRoot } from './code-block-root';
import { CodeBlockCode, CodeBlockCodeText } from './code-block-code';
import { CodeBlockContent } from './code-block-content';

/** Verify authored CSS receives stable native attributes through reactive updates. */
function verifiesCodeBlockCssHooks(): void {
  const [large, setLarge] = createSignal(false);
  const [focused, setFocused] = createSignal(false);

  /** Keep the same compound tree while appearance and metadata change. */
  function Example(): JSX.Element {
    return (
      <CodeBlockRoot
        code="one\ntwo"
        size={large() ? { base: 'sm', md: 'lg' } : 'md'}
        meta={{ focusedLineNumbers: focused() ? [2] : undefined, wordWrap: focused() }}
        class="consumer-block"
        style={{ '--leverui-code-block-radius': '17px' }}
        data-testid="root"
      >
        <CodeBlockContent data-testid="content">
          <CodeBlockCode data-testid="pre">
            <CodeBlockCodeText class="consumer-code" data-testid="code" />
          </CodeBlockCode>
        </CodeBlockContent>
      </CodeBlockRoot>
    );
  }

  render(
    /** Mount the native Code Block once. */
    () => <Example />,
  );
  const root = screen.getByTestId('root');
  const code = screen.getByTestId('code');
  expect(root).toHaveClass('leverui-code-block__root', 'consumer-block');
  expect(root).toHaveAttribute('data-size', 'md');
  expect(root).not.toHaveAttribute('data-size-md');
  expect(root.style.getPropertyValue('--leverui-code-block-radius')).toBe('17px');
  expect(code).toHaveClass('leverui-code-block__codeText', 'consumer-code');
  expect(code).not.toHaveAttribute('data-has-focused');
  setLarge(true);
  flush();
  setFocused(true);
  flush();
  expect(screen.getByTestId('root')).toBe(root);
  expect(screen.getByTestId('code')).toBe(code);
  expect(root).toHaveAttribute('data-size', 'sm');
  expect(root).toHaveAttribute('data-size-md', 'lg');
  expect(root).toHaveAttribute('data-has-focused', '');
  expect(code).toHaveAttribute('data-has-focused', '');
  expect(code).toHaveAttribute('data-word-wrap', '');
}

it(
  'emits stable finite and state hooks without replacing native elements',
  verifiesCodeBlockCssHooks,
);

/** Verify CodeText forwards its ref through the primitive's native child renderer. */
function verifiesCodeTextRef(): void {
  const [tag, setTag] = createSignal<'code' | 'span' | 'svg'>('code');
  const visited: Element[] = [];

  /** Capture each selected native element without replacing the root. */
  function captureElement(element: Element): void {
    visited.push(element);
  }

  /** Change only CodeText's selected native tag. */
  function Example(): JSX.Element {
    return (
      <CodeBlockRoot code="ready">
        <CodeBlockCodeText as={tag()} ref={captureElement} data-testid="selected-code" />
      </CodeBlockRoot>
    );
  }

  render(
    /** Mount one Code Block for reactive tag selection. */
    () => <Example />,
  );
  expect(visited.at(-1)).toBe(screen.getByTestId('selected-code'));
  expect(visited.at(-1)?.tagName).toBe('CODE');
  setTag('span');
  flush();
  expect(visited.at(-1)).toBe(screen.getByTestId('selected-code'));
  expect(visited.at(-1)?.tagName).toBe('SPAN');
  setTag('svg');
  flush();
  expect(visited.at(-1)).toBe(screen.getByTestId('selected-code'));
  expect(visited.at(-1)?.namespaceURI).toBe('http://www.w3.org/2000/svg');
}

it('forwards CodeText refs for native and selected tags', verifiesCodeTextRef);
