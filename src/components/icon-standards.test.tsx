import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Icon, IconPropsProvider, createIcon, type IconProps } from '../index';

type GetIconChildProps = Parameters<NonNullable<IconProps<'svg'>['asChild']>>[0];

/** Build a distinct SVG child whenever an Icon reads provider defaults. */
function renderSharedPath(): JSX.Element {
  return <path d="M1 1h2v2H1z" />;
}

/** Keep provider geometry separate across Icons and unrelated size updates. */
function verifiesSharedChildren(): void {
  const [size, setSize] = createSignal<'xs' | 'lg'>('xs');

  /** Bind the provider's size to one tracked component owner. */
  function Example(): JSX.Element {
    return (
      <>
        <IconPropsProvider value={{ size: size(), children: renderSharedPath }}>
          <Icon data-testid="shared-first" />
          <Icon data-testid="shared-second" />
          <Icon data-testid="local-geometry">
            <circle cx="2" cy="2" r="1" />
          </Icon>
        </IconPropsProvider>
      </>
    );
  }

  render(
    /** Mount two inherited Icons and one with its own SVG geometry. */
    () => <Example />,
  );
  const first = screen.getByTestId('shared-first');
  const second = screen.getByTestId('shared-second');
  const firstPath = first.querySelector('path');
  const secondPath = second.querySelector('path');
  expect(firstPath?.getAttribute('d')).toBe('M1 1h2v2H1z');
  expect(secondPath?.getAttribute('d')).toBe('M1 1h2v2H1z');
  expect(firstPath).not.toBe(secondPath);
  expect(screen.getByTestId('local-geometry').querySelector('path')).toBeNull();
  expect(screen.getByTestId('local-geometry').querySelector('circle')).not.toBeNull();
  setSize('lg');
  flush();
  expect(first.querySelector('path')).toBe(firstPath);
  expect(second.querySelector('path')).toBe(secondPath);
}

it(
  'renders fresh provider children per Icon and preserves them on size changes',
  verifiesSharedChildren,
);

/** Render a consumer-owned SVG for a created Icon's asChild path. */
function renderCreatedSvg(getProps: GetIconChildProps): JSX.Element {
  return <svg {...getProps()} data-testid="created-child-svg" />;
}

const CreatedIcon = createIcon({ d: 'M2 2h20v20H2z' });

/** Preserve created Icon paths and refs through native child composition. */
function verifiesCreatedChild(): void {
  let selected: SVGSVGElement | undefined;

  /** Capture the SVG selected by the created Icon. */
  function captureSvg(element: SVGSVGElement): void {
    selected = element;
  }

  render(
    /** Mount the created Icon through its published child renderer. */
    () => (
      <>
        <CreatedIcon asChild={renderCreatedSvg} ref={captureSvg} />
      </>
    ),
  );
  const svg = screen.getByTestId('created-child-svg');
  expect(svg).toBe(selected);
  expect(svg.querySelector('path')?.getAttribute('d')).toBe('M2 2h20v20H2z');
  expect(svg.getAttribute('aria-hidden')).toBe('true');
}

it('forwards created Icon geometry and refs through asChild', verifiesCreatedChild);
