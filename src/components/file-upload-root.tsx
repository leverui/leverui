import { splitProps } from '../primitives/utils/split-props';
import { FileUpload as PrimitiveFileUpload } from '../primitives/components/file-upload';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import type { FileUploadIntrinsicElement } from './file-upload-element-props';
import type { FileUploadRootProps, FileUploadRootProviderProps } from './file-upload-props';
import { useFileUploadRootProps } from './file-upload-props';
import type {
  FileUploadRuntimeProviderProps,
  FileUploadRuntimeRootProps,
} from './file-upload-runtime-props';

type RootInput =
  | { mode: 'root'; props: FileUploadRuntimeRootProps }
  | { mode: 'provider'; props: FileUploadRuntimeProviderProps };

/** Bind either primitive File Upload root to stable authored CSS hooks. */
function renderFileUploadRoot(input: RootInput): JSX.Element {
  const part = input.mode === 'root' ? PrimitiveFileUpload.Root : PrimitiveFileUpload.RootProvider;
  const [content, local, native] = splitProps(
    input.props,
    ['children'],
    [
      'unstyled',
      'colorPalette',
      'class',
      'className',
      'ref',
      'as',
      'asChild',
      ...nativeHtmlAliasNames,
    ],
  );

  /** Follow a caller-selected native root tag. */
  function readTag(): FileUploadIntrinsicElement {
    return local.as ?? 'div';
  }

  /** Forward the caller's current root ref. */
  function readRef(): unknown {
    return local.ref;
  }

  const primitiveProps = mergeProps(
    /** Preserve native attributes and current primitive machine options. */
    () => native,
    /** Convert supported native aliases before the primitive renders the root. */
    () => nativeHtmlAttributes(local),
    {
      /** Forward the caller's native root ref. */
      get ref() {
        return local.ref;
      },
      /** Compose the stable root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames(
          'file-upload__root',
          undefined,
          local.class,
          local.className,
        );
      },
      /** Bind semantic palette variables for dropzone interaction states. */
      get 'data-lui-color-palette'() {
        return local.colorPalette;
      },
      /** Suppress authored presentation without changing the file machine. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep public parts inside the primitive's machine context. */
      get children() {
        return content.children;
      },
      /** Preserve caller-owned or selected native root elements. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return createComponent(part as Component<typeof primitiveProps>, primitiveProps);
}

/** Render a File Upload with its own primitive and Zag machine. */
function FileUploadRootImpl(props: FileUploadRuntimeRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  const merged = useFileUploadRootProps(instance);
  const rootProps = mergeProps(merged, content);
  return renderFileUploadRoot({ mode: 'root', props: rootProps });
}

/** Expose native root props with a semantic palette and unstyled choice. */
export const FileUploadRoot = FileUploadRootImpl as <As extends FileUploadIntrinsicElement = 'div'>(
  props: FileUploadRootProps<As>,
) => JSX.Element;

/** Render a File Upload around a caller-owned primitive machine. */
function FileUploadRootProviderImpl(props: FileUploadRuntimeProviderProps): JSX.Element {
  return renderFileUploadRoot({ mode: 'provider', props });
}

/** Require the caller's machine accessor on provider roots. */
export const FileUploadRootProvider = FileUploadRootProviderImpl as <
  As extends FileUploadIntrinsicElement = 'div',
>(
  props: FileUploadRootProviderProps<As>,
) => JSX.Element;
