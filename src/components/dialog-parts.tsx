import { untrack } from 'solid-js';
import {
  Dialog as PrimitiveDialog,
  type DialogContentProps as PrimitiveContentProps,
  type DialogDescriptionProps as PrimitiveDescriptionProps,
  useDialogContext,
} from '../primitives/components/dialog';
import { usePresenceContext } from '../primitives/components/presence';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import { renderDialogPart } from './dialog-part';
import type { DialogPartProps, DialogRuntimeProps } from './dialog-part-props';
import type { ComponentIntrinsicElement } from './component-element-props';

type DialogPartComponent<Default extends 'button' | 'div' | 'h2'> = {
  <As extends ComponentIntrinsicElement>(
    props: DialogPartProps<Default, As> & { as: As },
  ): JSX.Element;
  (props: DialogPartProps<Default>): JSX.Element;
};

export type DialogTriggerProps = DialogPartProps<'button'>;
export type DialogBackdropProps = DialogPartProps<'div'>;
export type DialogPositionerProps = DialogPartProps<'div'>;
export type DialogContentProps = DialogPartProps<'div'>;
export type DialogTitleProps = DialogPartProps<'h2'>;
export type DialogDescriptionProps = DialogPartProps<'div'>;
export type DialogCloseTriggerProps = DialogPartProps<'button'>;

/** Render the primitive's trigger with Dialog slot styles. */
function DialogTriggerImpl(props: DialogRuntimeProps<'button'>): JSX.Element {
  const dialog = useDialogContext();
  const presence = usePresenceContext();
  const triggerProps = mergeProps(props, {
    /** Link the trigger to mounted content without the primitive's false attribute. */
    get 'aria-controls'() {
      return presence().unmounted ? undefined : dialog().getContentProps().id;
    },
  });
  return renderDialogPart(PrimitiveDialog.Trigger, 'trigger', triggerProps);
}

/** Render the primitive's portal backdrop with Dialog slot styles. */
function DialogBackdropImpl(props: DialogRuntimeProps<'div'>): JSX.Element {
  return renderDialogPart(PrimitiveDialog.Backdrop, 'backdrop', props);
}

/** Render the primitive's portal positioner with Dialog slot styles. */
function DialogPositionerImpl(props: DialogRuntimeProps<'div'>): JSX.Element {
  return renderDialogPart(PrimitiveDialog.Positioner, 'positioner', props);
}

/** Render the primitive's accessible content as a native div. */
function DialogContentImpl(props: DialogRuntimeProps<'div'>): JSX.Element {
  const presence = usePresenceContext();

  /** Deliver the native content to the primitive presence and the consumer ref. */
  function markContent(element: HTMLElement): void {
    presence().ref(element);
    if (typeof props.ref === 'function') props.ref(element);
  }

  /** Render the primitive's content attributes on the actual native div. */
  function renderDiv(
    getProps: Parameters<NonNullable<PrimitiveContentProps['asChild']>>[0],
  ): JSX.Element {
    return <Dynamic component="div" {...getProps({ ref: markContent })} />;
  }

  /** Keep the primitive presence and the consumer ref on selected content elements. */
  function readContentRef(): typeof markContent {
    return markContent;
  }

  return renderDialogPart(PrimitiveDialog.Content, 'content', props, renderDiv, readContentRef);
}

/** Render the primitive's generated title association on a native heading. */
function DialogTitleImpl(props: DialogRuntimeProps<'h2'>): JSX.Element {
  return renderDialogPart(PrimitiveDialog.Title, 'title', props);
}

/** Render the primitive's generated description association on the native div. */
function DialogDescriptionImpl(props: DialogRuntimeProps<'div'>): JSX.Element {
  /** Deliver the native description created by the primitive's child renderer. */
  function markDescription(element: HTMLElement): void {
    untrack(() => props.ref)?.(element);
  }

  /** Keep the description's the primitive ID and text on a native div. */
  function renderDiv(
    getProps: Parameters<NonNullable<PrimitiveDescriptionProps['asChild']>>[0],
  ): JSX.Element {
    return <Dynamic component="div" {...getProps({ ref: markDescription })} />;
  }

  /** Preserve the consumer ref when the native description changes. */
  function readDescriptionRef(): typeof markDescription {
    return markDescription;
  }

  return renderDialogPart(
    PrimitiveDialog.Description,
    'description',
    props,
    renderDiv,
    readDescriptionRef,
  );
}

/** Render the primitive's close control with native focus restoration. */
function DialogCloseTriggerImpl(props: DialogRuntimeProps<'button'>): JSX.Element {
  return renderDialogPart(PrimitiveDialog.CloseTrigger, 'closeTrigger', props);
}

/** Type the trigger against its selected or caller-owned element. */
export const DialogTrigger = DialogTriggerImpl as DialogPartComponent<'button'>;
/** Type the backdrop against its selected or caller-owned element. */
export const DialogBackdrop = DialogBackdropImpl as DialogPartComponent<'div'>;
/** Type the positioner against its selected or caller-owned element. */
export const DialogPositioner = DialogPositionerImpl as DialogPartComponent<'div'>;
/** Type the content against its selected or caller-owned element. */
export const DialogContent = DialogContentImpl as DialogPartComponent<'div'>;
/** Type the title against its selected or caller-owned element. */
export const DialogTitle = DialogTitleImpl as DialogPartComponent<'h2'>;
/** Type the description against its selected or caller-owned element. */
export const DialogDescription = DialogDescriptionImpl as DialogPartComponent<'div'>;
/** Type the close trigger against its selected or caller-owned element. */
export const DialogCloseTrigger = DialogCloseTriggerImpl as DialogPartComponent<'button'>;
