import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Blockquote } from '../index';
import {
  readBlockquoteJustify,
  readBlockquotePalette,
  readBlockquoteVariants,
} from './blockquote-choices';

/** Verify native quote semantics, attribution, icon defaults, and refs. */
function verifiesBlockquoteParts(): void {
  let figure: HTMLElement | undefined;

  /** Capture the native figure delivered by the root. */
  function captureFigure(element: HTMLElement): void {
    figure = element;
  }

  render(
    /** Mount every public part under its required root context. */
    () => (
      <Blockquote.Root ref={captureFigure} data-testid="quote-root" colorPalette="blue">
        <Blockquote.Icon data-testid="quote-icon" />
        <Blockquote.Content cite="https://example.com" data-testid="quote-content">
          A useful quotation.
        </Blockquote.Content>
        <Blockquote.Caption data-testid="quote-caption">
          <cite>A writer</cite>
        </Blockquote.Caption>
      </Blockquote.Root>
    ),
  );

  const root = screen.getByTestId('quote-root');
  expect(root).toBe(figure);
  expect(root.tagName).toBe('FIGURE');
  expect(root.className).toContain('leverui-blockquote');
  expect(root.getAttribute('data-variant')).toBe('subtle');
  expect(root.getAttribute('data-justify')).toBe('start');
  expect(root.hasAttribute('variant')).toBe(false);
  expect(root.hasAttribute('justify')).toBe(false);
  expect(screen.getByTestId('quote-content').tagName).toBe('BLOCKQUOTE');
  expect(screen.getByTestId('quote-content').className).toContain('leverui-blockquote__content');
  expect(screen.getByTestId('quote-content').getAttribute('cite')).toBe('https://example.com');
  expect(screen.getByTestId('quote-caption').tagName).toBe('FIGCAPTION');
  expect(screen.getByTestId('quote-caption').className).toContain('leverui-blockquote__caption');
  expect(screen.getByTestId('quote-icon').tagName.toLowerCase()).toBe('svg');
  expect(screen.getByTestId('quote-icon').getAttribute('class')).toContain(
    'leverui-blockquote__icon',
  );
  expect(screen.getByTestId('quote-icon').querySelector('path')).not.toBeNull();
  expect(screen.getByTestId('quote-icon').getAttribute('aria-hidden')).toBe('true');
}

it('renders semantic Blockquote parts and native attributes', verifiesBlockquoteParts);

/** Keep decorative defaults hidden while exposing a named custom icon. */
function verifiesIconAccessibility(): void {
  render(
    /** Mount default and custom icon states under the same quote root. */
    () => (
      <>
        <Blockquote.Root>
          <Blockquote.Icon data-testid="decorative-icon" />
          <Blockquote.Icon aria-label="Quoted marker" data-testid="named-icon">
            <circle cx="12" cy="12" r="8" />
          </Blockquote.Icon>
        </Blockquote.Root>
      </>
    ),
  );
  expect(screen.getByTestId('decorative-icon').getAttribute('aria-hidden')).toBe('true');
  expect(screen.getByTestId('named-icon').hasAttribute('aria-hidden')).toBe(false);
  expect(screen.getByTestId('named-icon').getAttribute('aria-label')).toBe('Quoted marker');
  expect(screen.getByTestId('named-icon').querySelector('circle')).not.toBeNull();
  expect(screen.getByTestId('named-icon').querySelector('path')).toBeNull();
}

it('exposes named custom icons while hiding decorative defaults', verifiesIconAccessibility);

/** Verify provider changes update a mounted root and its parts. */
function verifiesReactiveVariants(): void {
  const [centered, setCentered] = createSignal(false);

  /** Render inherited and explicitly overridden Blockquote roots. */
  function Example(): JSX.Element {
    return (
      <>
        <Blockquote.PropsProvider
          value={{ justify: centered() ? 'center' : 'start', variant: 'solid' }}
        >
          <Blockquote.Root data-testid="inherited-quote">
            <Blockquote.Content>Inherited</Blockquote.Content>
          </Blockquote.Root>
          <Blockquote.Root justify="end" data-testid="fixed-quote">
            <Blockquote.Content>Fixed</Blockquote.Content>
          </Blockquote.Root>
        </Blockquote.PropsProvider>
      </>
    );
  }

  render(
    /** Mount the changing provider once for a reactive update. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited-quote');
  const fixed = screen.getByTestId('fixed-quote');
  const inheritedClass = inherited.className;
  const fixedClass = fixed.className;
  expect(inherited.getAttribute('data-justify')).toBe('start');
  setCentered(true);
  flush();
  expect(inherited.className).toBe(inheritedClass);
  expect(inherited.getAttribute('data-justify')).toBe('center');
  expect(fixed.className).toBe(fixedClass);
  expect(fixed.getAttribute('data-justify')).toBe('end');
}

it('updates Blockquote defaults without replacing roots', verifiesReactiveVariants);

/** Keep responsive choices and native CSS overrides on the authored path. */
function verifiesAuthoredChoices(): void {
  render(
    /** Mount finite choices without involving the recipe runtime. */
    () => (
      <>
        <Blockquote.Root
          variant={{ base: 'subtle', md: 'solid' }}
          justify={{ base: 'start', md: 'end' }}
          title="Custom quote"
          class="article-quote"
          style={{ '--leverui-colors-color-palette-solid': 'rebeccapurple' }}
          data-testid="authored-quote"
        >
          <Blockquote.Content class="custom-content">Custom</Blockquote.Content>
        </Blockquote.Root>
      </>
    ),
  );

  const quote = screen.getByTestId('authored-quote');
  expect(quote.getAttribute('title')).toBe('Custom quote');
  expect(quote.hasAttribute('variant')).toBe(false);
  expect(quote.getAttribute('data-variant-md')).toBe('solid');
  expect(quote.getAttribute('data-justify-md')).toBe('end');
  expect(quote.classList.contains('article-quote')).toBe(true);
  expect(quote.style.getPropertyValue('--leverui-colors-color-palette-solid')).toBe(
    'rebeccapurple',
  );
  expect(screen.getByText('Custom').classList.contains('custom-content')).toBe(true);
  expect(quote.hasAttribute('data-leverui-private-style-runtime')).toBe(false);
}

it('keeps finite Blockquote choices on native CSS hooks', verifiesAuthoredChoices);

/** Reject unsupported runtime inputs before they reach public CSS attributes. */
function verifiesChoiceValidation(): void {
  expect(readBlockquoteVariants({ base: 'subtle', md: 'solid' }).md).toBe('solid');
  expect(readBlockquoteJustify({ base: 'start', md: 'end' }).md).toBe('end');
  expect(readBlockquotePalette(' blue ')).toBe('blue');
  expect(() => readBlockquoteVariants({ hover: 'solid' })).toThrow('unsupported breakpoint');
  expect(() => readBlockquoteJustify('left')).toThrow('unsupported');
  expect(() => readBlockquotePalette({ base: 'blue' })).toThrow('nonempty string');
}

it('rejects unsupported Blockquote choices and palettes', verifiesChoiceValidation);
