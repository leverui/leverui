import { splitProps } from '../primitives/utils/split-props';
import { Editable as PrimitiveEditable } from '../primitives/components/editable';
import { createComponent, createMemo, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef } from './primitive-child';
import { readEditableSizes } from './editable-choices';
import { EditablePresentationProvider } from './editable-presentation';
import type { EditableRootProps, EditableRootProviderProps } from './editable-props';
import { useEditableRootProps, useEditableRootProviderProps } from './editable-props';
import type {
  EditableRuntimeLocalProps,
  EditableRuntimeProviderProps,
  EditableRuntimeRootProps,
} from './editable-runtime-props';
import type { EditableIntrinsicElement } from './editable-types';

const rootParts = {
  root: PrimitiveEditable.Root,
  provider: PrimitiveEditable.RootProvider,
} as const;
type RootMode = keyof typeof rootParts;

type RootRenderer = {
  (mode: 'root', props: EditableRuntimeRootProps, content: { children?: JSX.Element }): JSX.Element;
  (
    mode: 'provider',
    props: EditableRuntimeProviderProps,
    content: { children?: JSX.Element },
  ): JSX.Element;
};

/** Bind Editable's authored CSS selectors around the primitive's machine-owned element. */
function renderEditableRootImpl(
  mode: RootMode,
  props: EditableRuntimeLocalProps,
  content: { children?: JSX.Element },
): JSX.Element {
  // RootRenderer requires provider value before the selected primitive boundary.
  const part = rootParts[mode] as Component<object>;
  const [local, rest] = splitProps(props, [
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    ...nativeHtmlAliasNames,
  ]);
  const sizes = createMemo(
    /** Validate changing size choices before binding CSS selectors. */
    () => readEditableSizes(local.size),
  );

  /** Follow the caller-selected root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Expose the caller ref to the primitive's child renderer. */
  function readRef(): unknown {
    return local.ref;
  }

  /** Share the current unstyled choice with descendant parts. */
  function readUnstyled(): boolean {
    return Boolean(local.unstyled);
  }

  const primitiveProps = mergeProps(
    /** Preserve machine options and native attributes. */
    () => rest,
    /** Convert native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    {
      /** Bind the base finite size to authored CSS. */
      get 'data-size'() {
        return sizes().base;
      },
      /** Bind the first responsive size override. */
      get 'data-size-sm'() {
        return sizes().sm;
      },
      /** Bind the second responsive size override. */
      get 'data-size-md'() {
        return sizes().md;
      },
      /** Bind the third responsive size override. */
      get 'data-size-lg'() {
        return sizes().lg;
      },
      /** Bind the fourth responsive size override. */
      get 'data-size-xl'() {
        return sizes().xl;
      },
      /** Bind the final responsive size override. */
      get 'data-size-2xl'() {
        return sizes()['2xl'];
      },
      /** Suppress default CSS without changing the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Preserve callback refs on the default root. */
      get ref() {
        return local.ref;
      },
      /** Compose stable and consumer classes. */
      get class() {
        return composeRecipeClassNames('editable__root', undefined, local.class, local.className);
      },
      /** Keep parts beneath the active primitive machine. */
      get children() {
        return content.children;
      },
      /** Preserve a selected child or native element. */
      get asChild() {
        if (local.asChild) return primitiveChildWithRef(local.asChild, readRef);
        return local.as ? primitiveAsChild<'div'>(readTag, readRef) : undefined;
      },
    },
  );

  return (
    <EditablePresentationProvider value={{ unstyled: readUnstyled }}>
      {/* The mode fixes its primitive part and required machine props. */}
      {createComponent(part, primitiveProps)}
    </EditablePresentationProvider>
  );
}

/** Require root or provider props for the matching primitive part. */
const renderEditableRoot = renderEditableRootImpl as RootRenderer;

/** Render an Editable with an internally owned primitive machine. */
function EditableRootImpl(props: unknown): JSX.Element {
  // Public props guarantee the machine and selected-element contract.
  const instance = props as EditableRuntimeRootProps;
  const [content, ownProps] = splitProps(instance, ['children']);
  return renderEditableRoot('root', useEditableRootProps(ownProps), content);
}

/** Expose native attributes for a caller-selected root tag. */
export const EditableRoot = EditableRootImpl as <As extends EditableIntrinsicElement = 'div'>(
  props: EditableRootProps<As>,
) => JSX.Element;

/** Render an Editable driven by a caller-owned machine. */
function EditableRootProviderImpl(props: unknown): JSX.Element {
  // Public props require a machine accessor before provider rendering.
  const instance = props as EditableRuntimeProviderProps;
  const [content, ownProps] = splitProps(instance, ['children']);
  return renderEditableRoot('provider', useEditableRootProviderProps(ownProps), content);
}

/** Expose native attributes for a selected caller-owned root tag. */
export const EditableRootProvider = EditableRootProviderImpl as <
  As extends EditableIntrinsicElement = 'div',
>(
  props: EditableRootProviderProps<As>,
) => JSX.Element;
