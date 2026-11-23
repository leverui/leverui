import { For, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CircleCheckIcon, CircleDashedIcon } from '@lucide/solid';
import { List, type ListIndicatorGetChildProps } from '../../src';
import './list-display.css';

const sampleItems = [
  'Create a new project and give it a short, clear name',
  'Invite your teammates and choose a role for each of them',
  'Connect your own domain so the site is ready to go live',
] as const;

const terms = [
  'Any breach of these terms by you or by someone using your account;',
  'Your use of the service, including anything you upload, share or store, and any loss of money, data or privacy that follows from it; and',
  'Any attempt to disrupt the service on purpose, for example by installing or spreading a virus, a worm, spyware, adware or any other program that runs on our systems, or that uses their processing time, at a moment when you are not directly using that program yourself for the purpose it was made for.',
] as const;

/** Render one shared sample item in either native list. */
function renderSampleItem(item: string): JSX.Element {
  return <List.Item>{item}</List.Item>;
}

/** Display the three-item unordered list. */
export function ListBasic(): JSX.Element {
  return (
    <List.Root>
      <For each={sampleItems}>{renderSampleItem}</For>
    </List.Root>
  );
}

/** Nest a second list inside the third outer item. */
export function ListNested(): JSX.Element {
  return (
    <List.Root>
      <List.Item>Top-level item</List.Item>
      <List.Item>Top-level item</List.Item>
      <List.Item>
        Top-level item with a list inside
        <List.Root style={{ 'padding-inline-start': 'var(--lui-spacing-5)' }}>
          <List.Item>Nested item</List.Item>
          <List.Item>Nested item</List.Item>
          <List.Item>Nested item</List.Item>
        </List.Root>
      </List.Item>
      <List.Item>Top-level item</List.Item>
    </List.Root>
  );
}

/** Render the sample content as an ordered list. */
export function ListOrdered(): JSX.Element {
  return (
    <List.Root as="ol">
      <For each={sampleItems}>{renderSampleItem}</For>
    </List.Root>
  );
}

/** Render a check circle as the list indicator's icon. */
function renderCheckIcon(getProps: ListIndicatorGetChildProps): JSX.Element {
  return <CircleCheckIcon {...getProps()} />;
}

/** Render a dashed circle as the final list indicator's icon. */
function renderDashedIcon(getProps: ListIndicatorGetChildProps): JSX.Element {
  return <CircleDashedIcon {...getProps()} />;
}

/** Render the matching check or dashed circle before one sample item. */
function renderIconItem(item: string, index: Accessor<number>): JSX.Element {
  return (
    <List.Item>
      <List.Indicator
        asChild={index() === 2 ? renderDashedIcon : renderCheckIcon}
        style={{ color: 'var(--lui-colors-green-500)' }}
      />
      {item}
    </List.Item>
  );
}

/** Place green Bootstrap Icons before the three list items. */
export function ListWithIcon(): JSX.Element {
  return (
    <List.Root style={{ '--lui-list-gap': 'var(--lui-spacing-2)' }} variant="plain" align="center">
      <For each={sampleItems}>{renderIconItem}</For>
    </List.Root>
  );
}

/** Keep the marker color while rendering one terms item. */
function renderTerm(item: string): JSX.Element {
  return <List.Item class="list-example-marker">{item}</List.Item>;
}

/** Preserve decimal markers and the long Terms of Service copy. */
export function ListWithMarkerStyle(): JSX.Element {
  return (
    <List.Root as="ol" style={{ 'list-style-type': 'decimal' }}>
      <For each={terms}>{renderTerm}</For>
    </List.Root>
  );
}
