import { splitProps } from '../primitives/utils/split-props';
import {
  useDownload,
  type DownloadableData,
  type UseDownloadProps,
  type UseDownloadReturn,
} from '../primitives/components/download-trigger';
import { createMemo, untrack } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RenderChild } from '../styled-system/child-props';
import { renderNativeLayoutChild } from '../styled-system/native-layout-child';
import type { NativeElementProps, NativeElementTag } from './native-element-props';
import { cx } from '../utils/cx';

export type DownloadTriggerProps<As extends NativeElementTag = 'button'> = NativeElementProps<
  'button',
  Omit<UseDownloadProps, 'onClick'>,
  As
>;

type DownloadDataProps = Omit<UseDownloadProps, 'onClick'>;
type RuntimeProps = Omit<JSX.HTMLAttributes<HTMLElement>, keyof DownloadDataProps | 'ref'> &
  DownloadDataProps & {
    as?: NativeElementTag | undefined;
    asChild?: RenderChild | undefined;
    ref?: ((element: Element) => void) | undefined;
    type?: string | undefined;
  };

/** Render a selected HTML tag without the style-object runtime. */
const DynamicElement = Dynamic as (
  props: { component: NativeElementTag } & JSX.HTMLAttributes<HTMLElement>,
) => JSX.Element;

/** Render a native download control that delegates file creation to the primitive. */
function DownloadTriggerRoot(props: RuntimeProps): JSX.Element {
  const [downloadProps, elementProps] = splitProps(props, [
    'data',
    'fileName',
    'mimeType',
    'onClick',
  ]);
  const [local, native] = splitProps(elementProps, ['as', 'asChild', 'ref', 'class', 'children']);
  const { download } = useDownload(
    /** Follow reactive data and metadata until the user activates the button. */
    () => ({
      data: downloadProps.data,
      fileName: downloadProps.fileName,
      mimeType: downloadProps.mimeType,
    }),
  );

  /** Preserve a caller's click cancellation before starting the download. */
  function handleClick(event: MouseEvent & { currentTarget: HTMLElement; target: Element }): void {
    const handler = downloadProps.onClick;
    if (typeof handler === 'function') handler(event);
    else if (handler) handler[0](handler[1], event);
    if (!event.defaultPrevented) download();
  }

  /** Forward the actual rendered node to the consumer's callback ref. */
  function attachNode(element: Element): void {
    untrack(() => local.ref)?.(element);
  }

  const attributes = createMemo(
    /** Follow native attributes and the consumer's class without generating CSS. */
    () => ({
      ...native,
      class: cx('lui-download-trigger', local.class),
      type: local.as && local.as !== 'button' ? native.type : 'button',
      onClick: handleClick,
      ref: attachNode,
    }),
  );

  return (
    <>
      {local.asChild ? (
        renderNativeLayoutChild(
          'DownloadTrigger',
          local.asChild,
          attributes,
          /** Keep caller-owned button content reactive. */
          () => local.children,
        )
      ) : (
        <DynamicElement component={local.as ?? 'button'} {...attributes()}>
          {local.children}
        </DynamicElement>
      )}
    </>
  );
}

/**
 * Download the current data on activation unless the caller cancels the click.
 * The generic signature binds native attributes and refs to the selected tag.
 */
export const DownloadTrigger = DownloadTriggerRoot as <As extends NativeElementTag = 'button'>(
  props: DownloadTriggerProps<As>,
) => JSX.Element;

export { useDownload };
export type { DownloadableData, UseDownloadProps, UseDownloadReturn };
