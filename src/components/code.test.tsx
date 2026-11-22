import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Code, CodePropsProvider, type CodeProps } from '../index';

type GetCodeChildProps = Parameters<NonNullable<CodeProps['asChild']>>[0];

/** Verify Code keeps native code semantics, attributes, and its public ref. */
function verifiesNativeCode(): void {
  let received: HTMLElement | undefined;

  /** Capture the native code element passed to the consumer. */
  function capture(element: HTMLElement): void {
    received = element;
  }

  render(
    /** Mount default Code without a styling provider. */
    () => (
      <Code ref={capture} title="Inline snippet" data-testid="native-code">
        npm run build
      </Code>
    ),
  );

  const code = screen.getByTestId('native-code');
  expect(code).toBe(received);
  expect(code.tagName).toBe('CODE');
  expect(code.textContent).toBe('npm run build');
  expect(code.getAttribute('title')).toBe('Inline snippet');
  expect(code.className).toContain('leverui-code');
  expect(code.getAttribute('data-size')).toBe('sm');
  expect(code.getAttribute('data-variant')).toBe('subtle');
  expect(code.hasAttribute('size')).toBe(false);
  expect(code.hasAttribute('variant')).toBe(false);
  expect(code.hasAttribute('role')).toBe(false);
}

it('renders native inline code without leaking presentation props', verifiesNativeCode);

/** Verify inherited appearance values update without replacing Code elements. */
function verifiesReactiveCodeDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Mount inherited and explicitly sized Code elements together. */
  function Example(): JSX.Element {
    return (
      <CodePropsProvider value={{ size: large() ? 'lg' : 'xs', variant: 'outline' }}>
        <Code data-testid="inherited-code">Inherited</Code>
        <Code size="sm" variant="solid" data-testid="fixed-code">
          Fixed
        </Code>
      </CodePropsProvider>
    );
  }

  render(
    /** Keep both Code elements mounted while defaults change. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited-code');
  const fixed = screen.getByTestId('fixed-code');
  const inheritedClass = inherited.className;
  const fixedClass = fixed.className;
  expect(inherited.getAttribute('data-size')).toBe('xs');
  setLarge(true);
  flush();
  expect(inherited.className).toBe(inheritedClass);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(fixed.className).toBe(fixedClass);
  expect(fixed.getAttribute('data-size')).toBe('sm');
  expect(inherited.hasAttribute('size')).toBe(false);
}

it('reacts to Code provider defaults and respects explicit props', verifiesReactiveCodeDefaults);

/** Verify Code supports native element selection and Solid child composition. */
function verifiesCodeComposition(): void {
  let selected: HTMLElement | undefined;

  /** Capture the element selected through Code's `as` prop. */
  function captureSelected(element: HTMLElement): void {
    selected = element;
  }

  /** Apply Code props to a consumer-owned strong element. */
  function renderChild(getProps: GetCodeChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="child-code">
        Important
      </strong>
    );
  }

  render(
    /** Mount both supported native composition paths. */
    () => (
      <>
        <Code as="span" ref={captureSelected} data-testid="selected-code">
          Selected
        </Code>
        <Code asChild={renderChild} />
      </>
    ),
  );

  expect(screen.getByTestId('selected-code')).toBe(selected);
  expect(selected?.tagName).toBe('SPAN');
  expect(screen.getByTestId('child-code').tagName).toBe('STRONG');
  expect(screen.getByTestId('child-code').className).toContain('leverui-code');
}

it('supports selected native elements and Solid child rendering', verifiesCodeComposition);
