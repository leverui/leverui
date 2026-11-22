import { Tag, type TagRootBaseProps, type TagRootProps } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

type GetTagChildProps = Parameters<NonNullable<TagRootProps['asChild']>>[0];

/** Exercise installed Tag parts, reactive styles, and native close behavior. */
export function PackedTag(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [closes, setCloses] = createSignal(0);
  const [actions, setActions] = createSignal(0);

  /** Read the active size for descendant Tag roots. */
  function readDefaults(): TagRootBaseProps {
    return { size: large() ? 'xl' : 'sm' };
  }

  /** Confirm the installed root forwards its real native div ref. */
  function captureRoot(element: HTMLDivElement): void {
    element.dataset.packedTagRef = element.tagName.toLowerCase();
  }

  /** Change inherited Tag size without remounting the label. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Count native close-button activations. */
  function closeTag(): void {
    setCloses(closes() + 1);
  }

  /** Count consumer-owned button activations. */
  function recordAction(): void {
    setActions(actions() + 1);
  }

  /** Apply Tag styling to a consumer-owned button. */
  function renderAction(getProps: GetTagChildProps): JSX.Element {
    return <button {...getProps()} type="button" id="packed-tag-action" />;
  }

  return (
    <section>
      <Tag.RootPropsProvider value={readDefaults}>
        <Tag.Root colorPalette="blue" id="packed-tag" ref={captureRoot}>
          <Tag.StartElement id="packed-tag-start">★</Tag.StartElement>
          <Tag.Label id="packed-tag-label">Installed category</Tag.Label>
          <Tag.EndElement id="packed-tag-end">
            <Tag.CloseTrigger id="packed-tag-close" onClick={closeTag} />
          </Tag.EndElement>
        </Tag.Root>
      </Tag.RootPropsProvider>
      <button type="button" id="packed-tag-toggle" onClick={toggleSize}>
        Change Tag size
      </button>
      <output id="packed-tag-closes">{closes()}</output>
      <div class="packed-tag-css">
        <Tag.Root id="packed-tag-css-root">
          <Tag.Label id="packed-tag-css-label">Consumer CSS</Tag.Label>
        </Tag.Root>
      </div>
      <Tag.Root asChild={renderAction} onClick={recordAction} variant="solid">
        <Tag.Label>Tag action</Tag.Label>
      </Tag.Root>
      <output id="packed-tag-actions">{actions()}</output>
    </section>
  );
}
