import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Box, Theme, type ThemeProps } from '../src';

type GetThemeProps = Parameters<NonNullable<ThemeProps['asChild']>>[0];

/** Demonstrate Theme's native element and merged child rendering paths. */
function ThemePolymorphismExample(): JSX.Element {
  const [parentClicks, setParentClicks] = createSignal(0);
  const [childClicks, setChildClicks] = createSignal(0);
  const [eventOrder, setEventOrder] = createSignal('');
  // Solid 2 defers signal reads until the next flush, so both handlers of one
  // click append to a plain string instead of reading the signal back.
  let order = '';

  /** Confirm the `as` path forwards its actual element to the ref. */
  function markSection(element: HTMLElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Mark the element received by the Theme ref. */
  function markParentRef(element: HTMLElement): void {
    element.dataset.parentRef = 'true';
  }

  /** Mark the same element through the child ref. */
  function markChildRef(element: HTMLElement): void {
    element.dataset.childRef = 'true';
  }

  /** Record a click from Theme's native event handler. */
  function countParentClick(): void {
    setParentClicks(parentClicks() + 1);
    order += 'parent';
    setEventOrder(order);
  }

  /** Record a click from the child's event handler. */
  function countChildClick(): void {
    setChildClicks(childClicks() + 1);
    order += 'child-';
    setEventOrder(order);
  }

  /** Apply both sets of props to one button element. */
  function renderButton(getProps: GetThemeProps): JSX.Element {
    return (
      <button
        type="button"
        {...getProps({
          class: 'child-theme',
          onClick: countChildClick,
          ref: markChildRef,
          style: { 'border-width': '3px' },
        })}
        data-testid="child-theme"
      >
        Scoped action
      </button>
    );
  }

  return (
    <>
      <Theme as="section" appearance="dark" data-testid="section-theme" ref={markSection}>
        Section scope
      </Theme>
      <Theme
        appearance="dark"
        asChild={renderButton}
        class="parent-theme"
        data-parent-attribute="true"
        onClick={countParentClick}
        ref={markParentRef}
        style={{ color: 'rgb(12, 34, 56)' }}
      />
      <Box data-testid="click-counts">
        {parentClicks()}:{childClicks()}
      </Box>
      <Box data-testid="event-order">{eventOrder()}</Box>
    </>
  );
}

const meta = {
  title: 'Setup/Theme Polymorphism',
  component: ThemePolymorphismExample,
} satisfies Meta<typeof ThemePolymorphismExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RenderProps: Story = {};
