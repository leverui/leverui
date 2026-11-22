import { splitProps } from '../primitives/utils/split-props';
import {
  Fieldset as PrimitiveFieldset,
  useFieldsetContext as usePrimitiveFieldsetContext,
} from '../primitives/components/fieldset';
import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { createComponent, createMemo, untrack, type Component } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { nativeHtmlAliasNames, nativeHtmlAttributes } from '../styled-system/native-html-aliases';
import { composeRecipeClassNames } from '../styled-system/recipe-class';
import { primitiveAsChild, primitiveChildWithRef, primitiveRenderWithRef } from './primitive-child';
import { readFiniteResponsiveChoice } from './finite-responsive-choice';
import type { UseFieldsetReturn } from './fieldset-contract';
import type { FieldsetRootProps, FieldsetRootProviderProps } from './fieldset-props';
import { FieldsetPresentationProvider } from './fieldset-presentation';

type FieldsetRootLikeProps = FieldsetRootProps | FieldsetRootProviderProps;

/** Pair an internally owned primitive root with the public Fieldset contract. */
function renderFieldsetRoot(
  part: typeof PrimitiveFieldset.Root,
  props: FieldsetRootProps,
  content: { children?: JSX.Element },
): JSX.Element;
/** Require an accessor when the primitive's root provider is selected. */
function renderFieldsetRoot(
  part: typeof PrimitiveFieldset.RootProvider,
  props: FieldsetRootProviderProps,
  content: { children?: JSX.Element },
  externalFieldset: FieldsetRootProviderProps,
): JSX.Element;
/** Bind either primitive Fieldset root to authored CSS selectors and native behavior. */
function renderFieldsetRoot<PrimitiveProps extends object>(
  part: Component<PrimitiveProps>,
  props: FieldsetRootLikeProps,
  content: { children?: JSX.Element },
  externalFieldset?: { value: UseFieldsetReturn },
): JSX.Element {
  const [local, rest] = splitProps(props, [
    'size',
    'unstyled',
    'class',
    'className',
    'ref',
    'as',
    'asChild',
    'render',
    ...nativeHtmlAliasNames,
  ]);
  const sizes = createMemo(
    /** Validate changing size choices before binding CSS selectors. */
    () =>
      readFiniteResponsiveChoice(local.size, new Set(['sm', 'md', 'lg']), 'md', 'Fieldset size'),
  );

  /** Follow the native tag selected by the caller. */
  function readTag(): keyof JSX.IntrinsicElements {
    return local.as ?? 'fieldset';
  }

  /** Connect a caller-owned accessor to its root observer and consumer ref. */
  function attachExternalRoot(element: HTMLFieldSetElement): void {
    externalFieldset?.value().refs.rootRef(element);
    if (typeof local.ref === 'function') local.ref(element);
  }

  /** Share the current unstyled choice with descendant parts. */
  function readUnstyled(): boolean {
    return Boolean(local.unstyled);
  }

  /** Attach the primitive's observer when a caller selects the rendered root. */
  function renderFieldsetChild(
    getProps: Parameters<NonNullable<PolymorphicProps<'fieldset'>['asChild']>>[0],
  ): JSX.Element {
    const fieldset = usePrimitiveFieldsetContext();

    /** Observe the actual child and forward it to the consumer. */
    function attachRoot(element: Element): void {
      // The primitive only observes descendants; its fieldset ref type is narrower than the DOM operation.
      fieldset().refs.rootRef(element as HTMLFieldSetElement);
      if (props.as !== undefined || props.asChild !== undefined)
        untrack(() => props.ref)?.(element);
    }

    const child = local.asChild
      ? primitiveChildWithRef(local.asChild, () => attachRoot)
      : primitiveAsChild<'fieldset'>(readTag, () => attachRoot);
    return child(getProps);
  }

  /** Attach the primitive's observer and the consumer ref under the primitive's `render`. */
  function renderFieldsetWithRender(
    ...args: Parameters<RenderFn<'fieldset', unknown>>
  ): ReturnType<RenderFn<'fieldset', unknown>> {
    const fieldset = usePrimitiveFieldsetContext();
    const render = local.render;
    if (!render) return undefined;

    /** Observe the rendered root and forward it to the consumer. */
    function attachRoot(element: Element): void {
      // The primitive only observes descendants; its fieldset ref type is narrower than the DOM operation.
      fieldset().refs.rootRef(element as HTMLFieldSetElement);
      if (props.render !== undefined) untrack(() => props.ref)?.(element);
    }

    return primitiveRenderWithRef(render, () => attachRoot)(...args);
  }

  const primitiveProps = mergeProps(
    /** Forward the primitive state and native attributes without style objects. */
    () => rest,
    /** Convert public native aliases at the primitive boundary. */
    () => nativeHtmlAttributes(local),
    {
      /** Bind the finite size choices to authored CSS at each breakpoint. */
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
      /** Suppress authored presentation without changing the primitive state. */
      get 'data-unstyled'() {
        return local.unstyled ? '' : undefined;
      },
      /** Retain the primitive's observer and the consumer's root ref. */
      get ref() {
        return externalFieldset ? attachExternalRoot : local.ref;
      },
      /** Keep the stable part hook and consumer classes. */
      get class() {
        return composeRecipeClassNames('fieldset__root', undefined, local.class, local.className);
      },
      /** Keep parts under the primitive and recipe contexts. */
      get children() {
        return content.children;
      },
      /** Preserve a caller-owned child or selected native element. */
      get asChild() {
        return local.asChild || local.as ? renderFieldsetChild : undefined;
      },
      /** Render the caller's element while keeping the Fieldset observer attached. */
      get render() {
        return local.render ? renderFieldsetWithRender : undefined;
      },
    },
  );

  return (
    <FieldsetPresentationProvider value={{ unstyled: readUnstyled }}>
      {/* The overloads bind each primitive root to its matching public props. */}
      {createComponent(part, primitiveProps as PrimitiveProps)}
    </FieldsetPresentationProvider>
  );
}

/** Render a native Fieldset with the primitive grouping and authored CSS hooks. */
export function FieldsetRoot(props: FieldsetRootProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFieldsetRoot(PrimitiveFieldset.Root, instance, content);
}

/** Render a Fieldset driven by a caller-owned primitive accessor. */
export function FieldsetRootProvider(props: FieldsetRootProviderProps): JSX.Element {
  const [content, instance] = splitProps(props, ['children']);
  return renderFieldsetRoot(PrimitiveFieldset.RootProvider, instance, content, instance);
}
