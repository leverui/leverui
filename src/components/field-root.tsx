import { splitProps } from '../primitives/utils/split-props';
import {
  Field as PrimitiveField,
  useFieldContext as usePrimitiveFieldContext,
} from '../primitives/components/field';
import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { createComponent, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef, primitiveRenderWithRef } from './primitive-child';
import type { UseFieldReturn } from './field-contract';
import { fieldOrientationAttributes } from './field-orientation';
import { FieldPresentationProvider } from './field-presentation';
import { useFieldProps, type FieldRootProps, type FieldRootProviderProps } from './field-props';

type FieldRootLikeProps = FieldRootProps | FieldRootProviderProps;

/** Pair an internally owned primitive root with the public Field contract. */
function renderFieldRoot(
  part: typeof PrimitiveField.Root,
  props: FieldRootProps,
  content: { children?: JSX.Element },
): JSX.Element;
/** Require an accessor whenever the primitive's root provider is selected. */
function renderFieldRoot(
  part: typeof PrimitiveField.RootProvider,
  props: FieldRootProviderProps,
  content: { children?: JSX.Element },
  externalField: FieldRootProviderProps,
): JSX.Element;
/** Bind the primitive Field semantics to stable classes and authored CSS selectors. */
function renderFieldRoot<PrimitiveProps extends object>(
  part: Component<PrimitiveProps>,
  props: FieldRootLikeProps,
  content: { children?: JSX.Element },
  externalField?: { value: UseFieldReturn },
): JSX.Element {
  const [local, rest] = splitProps(props, [
    'orientation',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'render',
    ...nativeHtmlAliasNames,
  ]);

  /** Follow the selected native Field root tag. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'div';
  }

  /** Give an externally owned Field its DOM observer and consumer ref. */
  function attachExternalRoot(element: HTMLDivElement): void {
    externalField?.value().refs.rootRef(element);
    if (typeof local.ref === 'function') local.ref(element);
  }

  /** Share the current unstyled selection with every Field part. */
  function readUnstyled(): boolean {
    return Boolean(local.unstyled);
  }

  /** Attach the primitive's field observer and the consumer ref to a selected child. */
  function renderFieldChild(
    getProps: Parameters<NonNullable<PolymorphicProps<'div'>['asChild']>>[0],
  ): JSX.Element {
    const field = usePrimitiveFieldContext();

    /** Keep the Field helper/error observer connected to its actual root. */
    function attachRoot(element: Element): void {
      field().refs.rootRef(element as HTMLDivElement);
      if (typeof local.ref === 'function') local.ref(element as HTMLDivElement);
    }

    const child = local.asChild
      ? primitiveChildWithRef(local.asChild, () => attachRoot)
      : primitiveAsChild<'div'>(readTag, () => attachRoot);
    return child(getProps);
  }

  /** Attach the primitive's field observer and the consumer ref under the primitive's `render`. */
  function renderFieldWithRender(
    ...args: Parameters<RenderFn<'div', unknown>>
  ): ReturnType<RenderFn<'div', unknown>> {
    const field = usePrimitiveFieldContext();
    const render = local.render;
    if (!render) return undefined;

    /** Keep the Field helper/error observer connected to the rendered root. */
    function attachRoot(element: Element): void {
      field().refs.rootRef(element as HTMLDivElement);
      if (typeof local.ref === 'function') local.ref(element as HTMLDivElement);
    }

    return primitiveRenderWithRef(render, () => attachRoot)(...args);
  }

  const primitiveProps = mergeProps(
    /** Forward native attributes and the primitive behavior without style extraction. */
    () => rest,
    /** Convert public native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    /** Reflect finite orientation choices through authored CSS hooks. */
    () => fieldOrientationAttributes(local.orientation),
    {
      /** Keep an external Field observable and forward its native root ref. */
      get ref() {
        return externalField ? attachExternalRoot : local.ref;
      },
      /** Combine the public root hook with consumer classes. */
      get class() {
        return composeRecipeClassNames('field__root', undefined, local.class, local.className);
      },
      /** Suppress default presentation without changing the primitive behavior. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Keep Field parts within the primitive and presentation contexts. */
      get children() {
        return content.children;
      },
      /** Preserve the caller's selected element or child. */
      get asChild() {
        return local.asChild || local.as ? renderFieldChild : undefined;
      },
      /** Render the caller's element while keeping the Field observer attached. */
      get render() {
        return local.render ? renderFieldWithRender : undefined;
      },
    },
  );

  return (
    <FieldPresentationProvider value={{ unstyled: readUnstyled }}>
      {/* The overloads bind each primitive root to its matching public props. */}
      {createComponent(part, primitiveProps as PrimitiveProps)}
    </FieldPresentationProvider>
  );
}

/** Render the primitive Field semantics with authored CSS presentation. */
export function FieldRoot(props: FieldRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFieldRoot(PrimitiveField.Root, useFieldProps(instance), content);
}

/** Render a Field root driven by a caller-owned primitive Field accessor. */
export function FieldRootProvider(props: FieldRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFieldRoot(PrimitiveField.RootProvider, instance, content, instance);
}
