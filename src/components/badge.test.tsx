import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import { Badge, BadgePropsProvider, type BadgeProps } from '../index';

type GetBadgeChildProps = Parameters<NonNullable<BadgeProps['asChild']>>[0];

/** Keep Badge's default span semantic and consumer-owned native attributes. */
function verifiesNativeBadge(): void {
  let received: HTMLSpanElement | undefined;

  /** Capture the native span passed through the public ref. */
  function capture(element: HTMLSpanElement): void {
    received = element;
  }

  render(
    /** Mount the default Badge through the public component. */
    () => (
      <>
        <Badge ref={capture} id="native-badge" title="Current status" data-testid="badge">
          Active
        </Badge>
      </>
    ),
  );

  const badge = screen.getByTestId('badge');
  expect(badge).toBe(received);
  expect(badge.tagName).toBe('SPAN');
  expect(badge.textContent).toBe('Active');
  expect(badge.getAttribute('title')).toBe('Current status');
  expect(badge.className).toContain('leverui-badge');
  expect(badge.hasAttribute('size')).toBe(false);
  expect(badge.hasAttribute('variant')).toBe(false);
  expect(badge.hasAttribute('role')).toBe(false);
}

it('preserves Badge span semantics and native attributes', verifiesNativeBadge);

/** Keep provider variants reactive while an instance can override them. */
function verifiesReactiveDefaults(): void {
  const [large, setLarge] = createSignal(false);

  /** Provide a changing size without remounting descendants. */
  function Example(): JSX.Element {
    return (
      <>
        <BadgePropsProvider value={{ size: large() ? 'lg' : 'xs', variant: 'outline' }}>
          <Badge data-testid="inherited">Inherited</Badge>
          <Badge size="sm" variant="solid" data-testid="explicit">
            Explicit
          </Badge>
        </BadgePropsProvider>
      </>
    );
  }

  render(
    /** Mount reactive Badge defaults and their override. */
    () => <Example />,
  );
  const inherited = screen.getByTestId('inherited');
  const explicit = screen.getByTestId('explicit');
  const inheritedClass = inherited.className;
  const explicitClass = explicit.className;
  expect(inherited).toHaveAttribute('data-size', 'xs');
  expect(inherited).toHaveAttribute('data-variant', 'outline');
  expect(explicit).toHaveAttribute('data-size', 'sm');
  expect(explicit).toHaveAttribute('data-variant', 'solid');
  setLarge(true);
  flush();
  expect(inherited).toHaveAttribute('data-size', 'lg');
  expect(inherited.className).toBe(inheritedClass);
  expect(explicit.className).toBe(explicitClass);
  expect(inherited.hasAttribute('size')).toBe(false);
  expect(inherited.hasAttribute('variant')).toBe(false);
}

it('reacts to provider defaults while preserving instance variants', verifiesReactiveDefaults);

/** Preserve selected native refs and Solid child composition. */
function verifiesPolymorphism(): void {
  let section: HTMLElement | undefined;

  /** Receive the native section selected by the Badge. */
  function captureSection(element: HTMLElement): void {
    section = element;
  }

  /** Place Badge styling and attributes on the consumer's child element. */
  function renderChild(getProps: GetBadgeChildProps): JSX.Element {
    return (
      <strong {...getProps()} data-testid="child-badge">
        Important
      </strong>
    );
  }

  render(
    /** Mount the selected native element and Solid child renderer. */
    () => (
      <>
        <Badge as="section" ref={captureSection} data-testid="section-badge">
          Section
        </Badge>
        <Badge asChild={renderChild} />
      </>
    ),
  );

  expect(screen.getByTestId('section-badge')).toBe(section);
  expect(section?.tagName).toBe('SECTION');
  expect(screen.getByTestId('child-badge').tagName).toBe('STRONG');
  expect(screen.getByTestId('child-badge').className).toContain('leverui-badge');
}

it('supports native polymorphism and Solid child composition', verifiesPolymorphism);
