import type { PolymorphicProps, RenderFn } from '../primitives/components/factory';
import { createComponent, type Accessor } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';

type IntrinsicElement = keyof JSX.IntrinsicElements;
type ElementRef = ((element: Element) => void) | undefined;

/** Recognize a callback ref at the primitive interop boundary. */
function isElementRef(value: unknown): value is NonNullable<ElementRef> {
  return typeof value === 'function';
}

/** Notify both owners when the primitive renders through its child callback. */
function composePrimitiveRefs(parent: unknown, child: unknown): ElementRef {
  if (!isElementRef(parent)) return isElementRef(child) ? child : undefined;
  if (!isElementRef(child)) return parent;

  /** Deliver the selected native element to both supplied refs. */
  return function notifyPrimitiveRefs(element: Element): void {
    parent(element);
    child(element);
  };
}

/** Put a parent ref back onto the primitive's child props, which omit it by design. */
export function primitiveChildWithRef<Tag extends IntrinsicElement>(
  render: NonNullable<PolymorphicProps<Tag>['asChild']>,
  parentRef: Accessor<unknown>,
): NonNullable<PolymorphicProps<Tag>['asChild']> {
  /** Compose the parent and any child-owned ref before rendering. */
  return function renderWithRef(getProps): JSX.Element {
    /** Merge Zag attributes with the child's native attributes. */
    function getPropsWithRef(childProps?: JSX.IntrinsicElements[Tag]): JSX.HTMLAttributes<Element> {
      const merged = getProps(childProps);
      return mergeProps(merged, {
        /** Follow parent and child refs as Solid resolves their props. */
        get ref() {
          return composePrimitiveRefs(parentRef(), childProps?.ref);
        },
      });
    }

    return render(getPropsWithRef);
  };
}

/** Put a parent ref back onto the primitive's `render` props, which also omit it. */
export function primitiveRenderWithRef<Tag extends IntrinsicElement, State>(
  render: RenderFn<Tag, State>,
  parentRef: Accessor<unknown>,
): RenderFn<Tag, State> {
  /** Compose the parent and any caller-supplied ref, keeping the state accessor. */
  return function renderWithRef(getProps, state): JSX.Element {
    /** Merge the part's props with the caller's, adding the parent ref. */
    function getPropsWithRef(callerProps?: JSX.IntrinsicElements[Tag]): Record<string, unknown> {
      return mergeProps(getProps(callerProps), {
        /** Follow parent and caller refs as Solid resolves their props. */
        get ref() {
          return composePrimitiveRefs(parentRef(), callerProps?.ref);
        },
      });
    }

    return render(getPropsWithRef, state);
  };
}

/** Adapt a selected native element to the primitive's Solid child renderer. */
export function primitiveAsChild<Tag extends IntrinsicElement>(
  tag: Accessor<IntrinsicElement>,
  parentRef: Accessor<unknown>,
): NonNullable<PolymorphicProps<Tag>['asChild']> {
  /** Keep machine attributes, events, refs, and children on the selected element. */
  function renderSelected(
    getProps: Parameters<NonNullable<PolymorphicProps<Tag>['asChild']>>[0],
  ): JSX.Element {
    return createComponent(
      Dynamic,
      mergeProps(
        {
          /** Follow the selected native tag while the primitive retains machine ownership. */
          get component() {
            return tag();
          },
        },
        getProps(),
      ),
    );
  }

  return primitiveChildWithRef(renderSelected, parentRef);
}
