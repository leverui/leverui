import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Icon, IconPropsProvider, createIcon, type IconProps } from '../index';

type GetIconChildProps = Parameters<NonNullable<IconProps<'svg'>['asChild']>>[0];

/** Keep decorative defaults overridable by an explicitly named image. */
function verifiesNativeSemantics(): void {
  let received: SVGSVGElement | undefined;

  /** Capture the consumer's native SVG ref. */
  function capture(element: SVGSVGElement): void {
    received = element;
  }

  render(
    /** Mount decorative and named Icons in one Solid owner. */
    () => (
      <>
        <Icon ref={capture} data-testid="default-icon" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" />
        </Icon>
        <Icon role="img" aria-label="Saved" aria-hidden="false" data-testid="named-icon" />
      </>
    ),
  );

  const decorative = screen.getByTestId('default-icon');
  expect(decorative).toBe(received);
  expect(decorative.tagName.toLowerCase()).toBe('svg');
  expect(decorative.getAttribute('focusable')).toBe('false');
  expect(decorative.getAttribute('aria-hidden')).toBe('true');
  expect(decorative.getAttribute('width')).toBe('1em');
  expect(decorative.getAttribute('height')).toBe('1em');
  expect(decorative.getAttribute('size')).toBeNull();
  expect(decorative.querySelector('path')?.getAttribute('d')).toBe('M0 0h24v24H0z');
  expect(screen.getByRole('img', { name: 'Saved' }).getAttribute('aria-hidden')).toBe('false');
}

it('renders native SVG children with overridable decorative defaults', verifiesNativeSemantics);

/** Preserve provider reactivity and the instance's size precedence. */
function verifiesProviderDefaults(): void {
  const [size, setSize] = createSignal<'xs' | 'lg'>('xs');

  /** Render two Icons that share defaults but select their own native attributes. */
  function Example(): JSX.Element {
    return (
      <>
        <IconPropsProvider value={{ size: size(), class: 'shared-icon', title: 'Shared icon' }}>
          <Icon data-testid="inherited-icon" class="local-icon" />
          <Icon data-testid="fixed-icon" size="sm" title="Local icon" />
        </IconPropsProvider>
      </>
    );
  }

  render(
    /** Mount the signal-driven provider once. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited-icon');
  const fixed = screen.getByTestId('fixed-icon');
  const before = inherited.getAttribute('class');
  const fixedClass = fixed.getAttribute('class');
  expect(before).toContain('shared-icon local-icon');
  expect(inherited.getAttribute('data-size')).toBe('xs');
  expect(fixed.getAttribute('data-size')).toBe('sm');
  expect(inherited.getAttribute('title')).toBe('Shared icon');
  expect(fixed.getAttribute('title')).toBe('Local icon');
  expect(inherited.getAttribute('size')).toBeNull();
  setSize('lg');
  flush();
  expect(screen.getByTestId('inherited-icon')).toBe(inherited);
  expect(inherited.getAttribute('class')).toBe(before);
  expect(inherited.getAttribute('data-size')).toBe('lg');
  expect(fixed.getAttribute('class')).toBe(fixedClass);
}

it('merges reactive Icon defaults and local overrides', verifiesProviderDefaults);

/** Render one consumer-owned SVG for the styled child path. */
function renderChildSvg(getProps: GetIconChildProps): JSX.Element {
  return (
    <svg {...getProps()} data-testid="child-icon" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="8" />
    </svg>
  );
}

/** Check selected-element refs and styled-child composition. */
function verifiesComposition(): void {
  let selected: HTMLSpanElement | undefined;

  /** Capture the selected span instead of the default SVG. */
  function captureSpan(element: HTMLSpanElement): void {
    selected = element;
  }

  render(
    /** Mount polymorphic, child-owned, and natively styled Icons. */
    () => (
      <>
        <Icon as="span" ref={captureSpan} data-testid="span-icon" />
        <Icon asChild={renderChildSvg} />
        <Icon class="custom-icon" style={{ 'border-width': '3px' }} data-testid="styled-icon" />
      </>
    ),
  );

  expect(screen.getByTestId('span-icon')).toBe(selected);
  expect(selected?.getAttribute('width')).toBeNull();
  expect(screen.getByTestId('child-icon').getAttribute('viewBox')).toBe('0 0 32 32');
  expect(screen.getByTestId('child-icon').getAttribute('aria-hidden')).toBe('true');
  expect(screen.getByTestId('styled-icon').getAttribute('class')).toContain('custom-icon');
  expect(screen.getByTestId('styled-icon').getAttribute('style')).toContain('border-width: 3px');
}

it('supports native selection, styled SVG children, and consumer styles', verifiesComposition);

/** Build fresh SVG children whenever one created Icon mounts. */
function renderCreatedPaths(): JSX.Element {
  return <circle cx="12" cy="12" r="9" />;
}

const RingIcon = createIcon({
  displayName: 'RingIcon',
  path: renderCreatedPaths,
  defaultProps: { size: 'sm', title: 'Shared ring' },
});
const PathIcon = createIcon({ d: 'M2 2h20v20H2z' });

/** Verify factory defaults, overrides, and separate SVG nodes. */
function verifiesCreatedIcons(): void {
  render(
    /** Mount two reusable rings and one single-path Icon. */
    () => (
      <>
        <RingIcon data-testid="first-ring" />
        <RingIcon data-testid="second-ring" title="Local ring" viewBox="0 0 32 32" />
        <PathIcon data-testid="path-icon" />
      </>
    ),
  );
  const first = screen.getByTestId('first-ring');
  const second = screen.getByTestId('second-ring');
  expect(RingIcon.displayName).toBe('RingIcon');
  expect(first.querySelector('circle')).not.toBe(second.querySelector('circle'));
  expect(first.getAttribute('title')).toBe('Shared ring');
  expect(second.getAttribute('title')).toBe('Local ring');
  expect(second.getAttribute('viewBox')).toBe('0 0 32 32');
  expect(screen.getByTestId('path-icon').querySelector('path')?.getAttribute('d')).toBe(
    'M2 2h20v20H2z',
  );
}

it('creates reusable Icons with per-instance SVG children', verifiesCreatedIcons);
