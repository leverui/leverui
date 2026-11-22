import { render, screen } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { expect, it } from 'vitest';
import type { RenderChild } from '../styled-system/child-props';
import { Stat, StatGroup } from './stat-exports';

/** Verify instance children can replace default trend SVGs. */
function verifiesStatIndicatorChildren(): void {
  render(
    /** Mount the override inside a semantic Stat root. */
    () => (
      <>
        <Stat.Root>
          <Stat.Label>Change</Stat.Label>
          <Stat.ValueText>12%</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator data-testid="custom-stat-indicator">
              <b>Rising</b>
            </Stat.UpIndicator>
          </Stat.HelpText>
        </Stat.Root>
      </>
    ),
  );

  const indicator = screen.getByTestId('custom-stat-indicator');
  expect(indicator.getAttribute('data-type')).toBe('up');
  expect(indicator.querySelector('svg')).toBeNull();
  expect(indicator.textContent).toBe('Rising');
}

it('lets consumers replace the default trend arrow', verifiesStatIndicatorChildren);

/** Verify explicit null suppresses either arrow while omitted children retain it. */
function verifiesNullIndicatorChildren(): void {
  render(
    /** Mount both trend directions inside one Stat root. */
    () => (
      <>
        <Stat.Root>
          <Stat.Label>Change</Stat.Label>
          <Stat.ValueText>12%</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator data-testid="empty-up" children={null} />
            <Stat.DownIndicator data-testid="empty-down" children={null} />
            <Stat.UpIndicator data-testid="default-up" />
            <Stat.DownIndicator data-testid="default-down" />
          </Stat.HelpText>
        </Stat.Root>
      </>
    ),
  );

  for (const direction of ['up', 'down']) {
    const empty = screen.getByTestId(`empty-${direction}`);
    expect(empty.getAttribute('data-type')).toBe(direction);
    expect(empty.querySelector('svg')).toBeNull();
    expect(empty.textContent).toBe('');
    expect(screen.getByTestId(`default-${direction}`).querySelector('svg')).not.toBeNull();
  }
}

it('treats null indicator children as an explicit empty override', verifiesNullIndicatorChildren);

/** Keep unstyled semantics while forwarding native CSS styles. */
function verifiesStatPresentationPaths(): void {
  render(
    /** Mount authored, unstyled, and natively styled Stat roots together. */
    () => (
      <>
        <Stat.Root data-testid="authored-stat" size="lg">
          <Stat.Label data-testid="authored-label">Visitors</Stat.Label>
          <Stat.ValueText>42</Stat.ValueText>
        </Stat.Root>
        <Stat.Root data-testid="unstyled-stat" unstyled>
          <Stat.Label data-testid="unstyled-label" unstyled>
            Visitors
          </Stat.Label>
          <Stat.ValueText>42</Stat.ValueText>
        </Stat.Root>
        <Stat.Root data-testid="custom-stat" style={{ padding: '4px' }}>
          <Stat.Label>Visitors</Stat.Label>
          <Stat.ValueText>42</Stat.ValueText>
        </Stat.Root>
      </>
    ),
  );

  const authored = screen.getByTestId('authored-stat');
  expect(authored.getAttribute('data-size')).toBe('lg');
  expect(authored.hasAttribute('data-leverui-private-style-runtime')).toBe(false);
  expect(screen.getByTestId('authored-label').className).toContain('leverui-stat__label');
  expect(screen.getByTestId('unstyled-stat').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('unstyled-label').hasAttribute('data-unstyled')).toBe(true);
  expect(screen.getByTestId('custom-stat').getAttribute('style')).toContain('padding: 4px');
}

it('preserves authored, unstyled, and native style paths', verifiesStatPresentationPaths);

type GetChildProps = Parameters<RenderChild>[0];

/** Render a caller-owned description list with merged Stat attributes. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return <dl {...getProps({ class: 'owned-stat-root' })} data-testid="owned-stat-root" />;
}

/** Render a caller-owned term with merged Stat part attributes. */
function renderOwnedLabel(getProps: GetChildProps): JSX.Element {
  return <dt {...getProps({ class: 'owned-stat-label' })} data-testid="owned-stat-label" />;
}

/** Verify native caller-owned nodes retain Stat semantics and class hooks. */
function verifiesOwnedStatParts(): void {
  render(
    /** Mount the root before its scoped term resolves. */
    () => (
      <Stat.Root asChild={renderOwnedRoot} size="lg">
        <Stat.Label asChild={renderOwnedLabel}>Visitors</Stat.Label>
        <Stat.ValueText>42</Stat.ValueText>
      </Stat.Root>
    ),
  );
  const root = screen.getByTestId('owned-stat-root');
  expect(root.tagName).toBe('DL');
  expect(root.getAttribute('data-size')).toBe('lg');
  expect(root.className).toContain('leverui-stat__root');
  expect(root.className).toContain('owned-stat-root');
  const label = screen.getByTestId('owned-stat-label');
  expect(label.tagName).toBe('DT');
  expect(label.className).toContain('leverui-stat__label');
  expect(label.textContent).toBe('Visitors');
}

it('preserves caller-owned Stat nodes through asChild', verifiesOwnedStatParts);

/** Render a caller-owned section in place of the default group div. */
function renderOwnedGroup(getProps: GetChildProps): JSX.Element {
  return <section {...getProps()} data-testid="owned-stat-group" />;
}

/** Forward a nondefault group element through its precise caller-owned ref. */
function verifiesOwnedGroupRef(): void {
  let group: HTMLElement | undefined;

  /** Capture the caller-owned native section. */
  function captureGroup(element: HTMLElement): void {
    group = element;
  }

  render(
    /** Mount the section before resolving its nested description list. */
    () => (
      <StatGroup asChild={renderOwnedGroup} ref={captureGroup} size="lg">
        <Stat.Root data-testid="owned-group-stat">
          <Stat.Label>Visitors</Stat.Label>
          <Stat.ValueText>42</Stat.ValueText>
        </Stat.Root>
      </StatGroup>
    ),
  );
  const section = screen.getByTestId('owned-stat-group');
  expect(section).toBe(group);
  expect(section.tagName).toBe('SECTION');
  expect(section.className).toContain('leverui-stat__group');
  expect(screen.getByTestId('owned-group-stat').getAttribute('data-size')).toBe('lg');
}

it('forwards a caller-owned group element and its inherited size', verifiesOwnedGroupRef);

/** Reject a responsive choice that authored selectors cannot represent. */
function verifiesInvalidStatSize(): void {
  /** Attempt to mount an unsupported runtime size. */
  function mountInvalid(): void {
    render(() => <Stat.Root size={'xl' as 'sm'} />);
  }
  expect(mountInvalid).toThrow(/Stat size uses an unsupported/);
}

it('rejects unsupported Stat sizes', verifiesInvalidStatSize);
