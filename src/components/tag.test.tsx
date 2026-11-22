import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Tag } from './tag-exports';
import { type TagRootBaseProps } from './tag-props';
import { TagRoot } from './tag-root';

/** Preserve native parts, close defaults, attributes, events, and refs. */
function verifiesNativeParts(): void {
  let root: HTMLDivElement | undefined;
  let closeCount = 0;

  /** Capture the real root element rather than a span type. */
  function captureRoot(element: HTMLDivElement): void {
    root = element;
  }

  /** Count clicks forwarded from the native close button. */
  function closeTag(): void {
    closeCount += 1;
  }

  render(
    /** Mount the public namespace and all native Tag parts. */
    () => (
      <>
        <Tag.Root ref={captureRoot} title="Category" data-testid="tag">
          <Tag.StartElement data-testid="start">★</Tag.StartElement>
          <Tag.Label data-testid="label">Featured</Tag.Label>
          <Tag.EndElement data-testid="end">
            <Tag.CloseTrigger data-testid="close" onClick={closeTag} />
          </Tag.EndElement>
        </Tag.Root>
      </>
    ),
  );

  const tag = screen.getByTestId('tag');
  const close = screen.getByTestId('close');
  expect(tag).toBe(root);
  expect(tag.tagName).toBe('DIV');
  expect(tag.getAttribute('title')).toBe('Category');
  expect(screen.getByTestId('start').tagName).toBe('SPAN');
  expect(screen.getByTestId('label').textContent).toBe('Featured');
  expect(screen.getByTestId('end').tagName).toBe('SPAN');
  expect(close.tagName).toBe('BUTTON');
  expect(close.getAttribute('type')).toBe('button');
  expect(close.getAttribute('aria-label')).toBe('Close');
  expect(close.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  close.click();
  expect(closeCount).toBe(1);
  expect(tag.hasAttribute('size')).toBe(false);
  expect(tag.hasAttribute('variant')).toBe(false);
}

it('renders native Tag parts and the default close control', verifiesNativeParts);

/** Preserve custom close content and an explicit native submit type. */
function verifiesCloseOverrides(): void {
  render(
    /** Mount custom content in the same Tag style context. */
    () => (
      <>
        <TagRoot>
          <Tag.CloseTrigger type="submit" data-testid="custom-close">
            Remove
          </Tag.CloseTrigger>
        </TagRoot>
      </>
    ),
  );
  const close = screen.getByTestId('custom-close');
  expect(close.getAttribute('type')).toBe('submit');
  expect(close.textContent).toBe('Remove');
  expect(close.querySelector('svg')).toBeNull();
  expect(close.getAttribute('aria-label')).toBeNull();
}

it('respects close-trigger native type and custom children', verifiesCloseOverrides);

/** Update inherited recipe variants without replacing the Tag elements. */
function verifiesReactiveDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Render inherited and explicitly sized tags together. */
  function Example(): JSX.Element {
    /** Read changing defaults from the test signal. */
    function readDefaults(): TagRootBaseProps {
      return { size: large() ? 'xl' : 'sm' };
    }

    return (
      <>
        <Tag.RootPropsProvider value={readDefaults}>
          <Tag.Root data-testid="inherited">
            <Tag.Label data-testid="inherited-label">Inherited</Tag.Label>
          </Tag.Root>
          <Tag.Root size="md" data-testid="fixed">
            <Tag.Label>Fixed</Tag.Label>
          </Tag.Root>
        </Tag.RootPropsProvider>
      </>
    );
  }

  render(
    /** Mount both roots before changing provider defaults. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const label = screen.getByTestId('inherited-label');
  const fixed = screen.getByTestId('fixed');
  const initialClass = inherited.className;
  const initialLabelClass = label.className;
  expect(inherited.getAttribute('data-size')).toBe('sm');
  expect(fixed.getAttribute('data-size')).toBe('md');
  setLarge(true);
  flush();
  expect(screen.getByTestId('inherited')).toBe(inherited);
  expect(screen.getByTestId('inherited-label')).toBe(label);
  expect(inherited.getAttribute('data-size')).toBe('xl');
  expect(inherited.className).toBe(initialClass);
  expect(label.className).toBe(initialLabelClass);
  expect(fixed.getAttribute('data-size')).toBe('md');
}

it('updates Tag provider variants while honoring explicit root props', verifiesReactiveDefaults);

/** Reject a styled part without a Tag root style context. */
function verifiesRootRequirement(): void {
  /** Attempt to mount a label outside its required root. */
  function mountOrphan(): void {
    render(
      /** Keep the package provider present while omitting TagRoot. */
      () => (
        <>
          <Tag.Label>Orphan</Tag.Label>
        </>
      ),
    );
  }

  expect(mountOrphan).toThrow(/inside TagRoot/);
}

it('requires a Tag root for styled parts', verifiesRootRequirement);

/** Keep unstyled parts and native styles on their intended paths. */
function verifiesTagPresentationPaths(): void {
  render(
    /** Mount unstyled and natively styled roots under the default provider. */
    () => (
      <>
        <Tag.Root unstyled data-testid="unstyled-tag">
          <Tag.Label unstyled data-testid="unstyled-tag-label">
            Plain
          </Tag.Label>
        </Tag.Root>
        <Tag.Root style={{ padding: '4px' }} data-testid="custom-tag">
          <Tag.Label>Custom</Tag.Label>
        </Tag.Root>
      </>
    ),
  );
  expect(screen.getByTestId('unstyled-tag').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('unstyled-tag-label').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('custom-tag').getAttribute('style')).toContain('padding: 4px');
}

it('preserves unstyled and native style paths', verifiesTagPresentationPaths);
