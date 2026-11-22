import { splitProps } from '../primitives/utils/split-props';
import { For } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import { renderFileUploadPart, renderFileUploadPartImpl } from './file-upload-part';
import type {
  FileUploadFileTextProps,
  FileUploadItemsProps,
  FileUploadListProps,
} from './file-upload-part-props';
import {
  FileUploadItemContent,
  FileUploadItemDeleteTrigger,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemSizeText,
} from './file-upload-item-parts';
import { useFileUploadContext } from './file-upload-machine';
import { FileUploadItemGroup } from './file-upload-parts';

/** Render each accepted or caller-supplied file with standard item parts. */
export function FileUploadItems<As extends FileUploadIntrinsicElement = 'li'>(
  props: FileUploadItemsProps<As>,
): JSX.Element {
  const fileUpload = useFileUploadContext();
  const [local, rest] = splitProps(props, ['showSize', 'clearable', 'files']);
  return (
    <For each={local.files ?? fileUpload().acceptedFiles}>
      {
        /** Bind a stable File object to one list item and its actions. */
        (file) => {
          let children: JSX.Element | undefined;
          let content: JSX.Element | undefined;

          /** Reuse name and size parts when the content element reads children. */
          function readContent(): JSX.Element {
            content ??= (
              <>
                <FileUploadItemName />
                <FileUploadItemSizeText />
              </>
            );
            return content;
          }

          /** Reuse one styled subtree when the primitive reads the item child twice. */
          function readChildren(): JSX.Element {
            children ??= (
              <>
                <FileUploadItemPreview />
                {local.showSize ? (
                  <FileUploadItemContent>{readContent()}</FileUploadItemContent>
                ) : (
                  <FileUploadItemName class="leverui-file-upload__item-name-fill" />
                )}
                {local.clearable && <FileUploadItemDeleteTrigger />}
              </>
            );
            return children;
          }

          return renderFileUploadPartImpl(
            'item',
            mergeProps(rest, {
              file,
              /** Fill the item with the standard preview, name, and actions. */
              get children() {
                return readChildren();
              },
            }),
          );
        }
      }
    </For>
  );
}

/** Render the list after its public selected-element contract is checked. */
function FileUploadListImpl(props: unknown): JSX.Element {
  // The public signature guarantees the selected tag and item-group attributes.
  const listProps = props as FileUploadListProps;
  const [local, rest] = splitProps(listProps, ['showSize', 'clearable', 'files']);
  let items: JSX.Element | undefined;

  /** Reuse one tracked item list when the primitive reads group children twice. */
  function readItems(): JSX.Element {
    items ??= (
      <FileUploadItems showSize={local.showSize} clearable={local.clearable} files={local.files} />
    );
    return items;
  }

  return <FileUploadItemGroup {...rest}>{readItems()}</FileUploadItemGroup>;
}

/** Combine the native item group with the standard accepted-files list. */
export const FileUploadList = FileUploadListImpl as <As extends FileUploadIntrinsicElement = 'ul'>(
  props: FileUploadListProps<As>,
) => JSX.Element;

/** Summarize selected files while marking the empty fallback as a placeholder. */
function FileUploadFileTextImpl(props: unknown): JSX.Element {
  const fileUpload = useFileUploadContext();
  // The public signature validates the selected tag before the style adapter.
  const source = props as FileUploadFileTextProps;
  const [local, rest] = splitProps(source, ['fallback', 'children']);

  /** Follow the primitive's accepted files and the current fallback text. */
  function readText(): string {
    const files = fileUpload().acceptedFiles;
    if (files.length === 1) return files[0]?.name ?? '';
    if (files.length > 1) return `${files.length} files`;
    return local.fallback ?? 'Select file(s)';
  }

  const textProps = mergeProps(
    {
      'data-file-upload-file-text': '',
      /** Mark the empty state for consumer CSS selectors. */
      get 'data-placeholder'() {
        return readText() === (local.fallback ?? 'Select file(s)') ? '' : undefined;
      },
      /** Display the current file summary without freezing the accessor. */
      get children() {
        return readText();
      },
    },
    rest,
  );

  // mergeProps preserves the selected tag while adding computed FileText fields.
  return renderFileUploadPart<'span'>('fileText', textProps as FileUploadFileTextProps);
}

/** Expose FileText attributes for the caller-selected native tag. */
export const FileUploadFileText = FileUploadFileTextImpl as <
  As extends FileUploadIntrinsicElement = 'span',
>(
  props: FileUploadFileTextProps<As>,
) => JSX.Element;
