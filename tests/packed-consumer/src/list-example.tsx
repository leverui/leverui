import {
  List,
  ListRoot,
  ListRootPropsProvider,
  type ListIndicatorProps,
  type ListItemProps,
  type ListRootProps,
} from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

const orderedProps: ListRootProps<'ol'> = {
  as: 'ol',
  start: 3,
  style: { 'list-style-type': 'decimal' },
};
type GetIndicatorProps = Parameters<NonNullable<ListIndicatorProps['asChild']>>[0];
type GetRootProps = Parameters<NonNullable<ListRootProps['asChild']>>[0];
type GetItemProps = Parameters<NonNullable<ListItemProps['asChild']>>[0];

/** Record the installed ordered root selected by asChild. */
function markPackedRoot(element: HTMLElement): void {
  element.setAttribute('data-packed-root-ref', 'received');
}

/** Select a consumer-owned ordered list through the public root contract. */
function renderPackedRoot(getProps: GetRootProps): JSX.Element {
  return <ol {...getProps({ class: 'packed-child-root' })} id="packed-child-root" start={4} />;
}

/** Record the installed list item selected by asChild. */
function markPackedItem(element: HTMLLIElement): void {
  element.setAttribute('data-packed-item-ref', 'received');
}

/** Select a consumer-owned list item through the public part contract. */
function renderPackedItem(getProps: GetItemProps): JSX.Element {
  return <li {...getProps({ class: 'packed-child-item' })} id="packed-child-item" />;
}

/** Record the parent ref on the selected SVG element. */
function markPackedIcon(element: Element): void {
  element.setAttribute('data-packed-ref', 'received');
}

/** Record the consumer SVG ref on the packaged child element. */
function markPackedChildIcon(element: SVGSVGElement): void {
  element.setAttribute('data-packed-child-ref', 'received');
}

/** Supply a consumer-owned SVG through the installed List child API. */
function renderPackedIcon(getProps: GetIndicatorProps): JSX.Element {
  return (
    <svg
      {...getProps({
        class: 'packed-list-icon',
        role: 'img',
        'aria-label': 'Complete',
        ref: markPackedChildIcon,
        viewBox: '0 0 24 24',
      })}
      id="packed-list-indicator"
    >
      <path d="M5 12l4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  );
}

/** Confirm a bare SVG can spread child props without SVG-only hints. */
function renderBareSvg(getProps: GetIndicatorProps): JSX.Element {
  return (
    <svg {...getProps()} id="packed-list-bare-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

/** Confirm shared class props retain an SVG-compatible return type. */
function renderClassSvg(getProps: GetIndicatorProps): JSX.Element {
  return (
    <svg
      {...getProps({ class: 'packed-class-icon' })}
      id="packed-list-class-icon"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

/** Record native click delivery on a selected SVG rather than a span. */
function recordPackedIconClick(event: MouseEvent & { currentTarget: Element }): void {
  event.currentTarget.setAttribute('data-packed-clicked', 'true');
}

/** Keep non-SVG child rendering available for custom text indicators. */
function renderPackedText(getProps: GetIndicatorProps): JSX.Element {
  return (
    <strong {...getProps({ class: 'packed-list-text' })} id="packed-list-html-indicator">
      !
    </strong>
  );
}

/** Exercise installed List types, native elements, nested parts, and updates. */
export function PackedList(): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Change an inherited variant without remounting the list. */
  function toggleVariant(): void {
    setPlain(!plain());
  }

  return (
    <section>
      <ListRootPropsProvider value={{ variant: plain() ? 'plain' : 'marker' }}>
        <ListRoot asChild={renderPackedRoot} ref={markPackedRoot} title="Packed owned tasks">
          <List.Item asChild={renderPackedItem} ref={markPackedItem}>
            Owned item
          </List.Item>
        </ListRoot>
        <ListRoot id="packed-list-default">
          <List.Item id="packed-list-item">First item</List.Item>
        </ListRoot>
        <ListRoot {...orderedProps} id="packed-list-ordered" variant="marker">
          <List.Item id="packed-list-ordered-item">Third item</List.Item>
        </ListRoot>
      </ListRootPropsProvider>
      <List.Root variant="plain" align="center" id="packed-list-plain">
        <List.Item id="packed-list-plain-item">
          <List.Indicator
            asChild={renderPackedIcon}
            style={{ color: 'var(--leverui-colors-green-500)' }}
            ref={markPackedIcon}
            onClick={recordPackedIconClick}
          />
          Checked item
        </List.Item>
        <List.Item>
          <List.Indicator asChild={renderBareSvg} />
          Bare icon item
        </List.Item>
        <List.Item>
          <List.Indicator asChild={renderClassSvg} />
          Class icon item
        </List.Item>
        <List.Item>
          <List.Indicator asChild={renderPackedText} />
          Important item
        </List.Item>
      </List.Root>
      <div class="packed-list-css">
        <List.Root id="packed-list-css-root">
          <List.Item id="packed-list-css-item">Themed item</List.Item>
        </List.Root>
      </div>
      <button id="packed-list-toggle" type="button" onClick={toggleVariant}>
        Change List variant
      </button>
    </section>
  );
}
