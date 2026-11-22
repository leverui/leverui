import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import './dialog-polymorphic.css';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Portal,
} from '../src';

/** Exercise caller-rendered and selected native elements under the primitive Dialog. */
function DialogPolymorphicExample(): JSX.Element {
  /** Mark the caller-owned trigger element delivered to its ref. */
  function captureTrigger(element: Element): void {
    element.setAttribute('data-dialog-trigger-ref', 'attached');
  }

  /** Mark the selected content element delivered to the consumer. */
  function captureContent(element: HTMLElement): void {
    element.dataset.dialogRef = 'attached';
  }

  /** Mark an anchor selected for the close trigger. */
  function captureSelectedClose(element: HTMLAnchorElement): void {
    element.dataset.selectedCloseRef = 'attached';
  }

  /** Mark the layout slot ref supplied to the Dialog component. */
  function captureLayoutParent(element: Element): void {
    element.setAttribute('data-layout-parent-ref', 'attached');
  }

  /** Mark the caller-rendered layout element's own ref. */
  function captureLayoutChild(element: HTMLElement): void {
    element.dataset.layoutChildRef = 'attached';
  }

  return (
    <>
      <DialogRoot>
        <DialogTrigger
          ref={captureTrigger}
          asChild={
            /** Preserve the primitive's trigger events on a caller-rendered button. */
            (getProps) => <button {...getProps()} data-testid="dialog-child-trigger" />
          }
        >
          Open polymorphic Dialog
        </DialogTrigger>
        <Portal>
          <DialogPositioner>
            <DialogContent as="article" ref={captureContent} data-testid="dialog-article-content">
              <DialogHeader
                ref={captureLayoutParent}
                class="layout-parent dialog-polymorphic-header"
                data-testid="dialog-layout-header"
                asChild={
                  /** Keep the title and slot styles on a caller-rendered header. */
                  (getProps) => (
                    <header {...getProps({ ref: captureLayoutChild, class: 'layout-child' })} />
                  )
                }
              >
                <DialogTitle>Polymorphic Dialog</DialogTitle>
              </DialogHeader>
              <DialogBody
                ref={captureLayoutParent}
                class="dialog-polymorphic-body"
                data-testid="dialog-layout-body"
                asChild={
                  /** Keep the description and slot styles on a caller-rendered section. */
                  (getProps) => <section {...getProps({ ref: captureLayoutChild })} />
                }
              >
                <DialogDescription
                  asChild={
                    /** Keep generated description IDs on a caller-rendered span. */
                    (getProps) => <span {...getProps()} data-testid="dialog-child-description" />
                  }
                >
                  Native parts remain accessible.
                </DialogDescription>
              </DialogBody>
              <DialogFooter
                ref={captureLayoutParent}
                class="dialog-polymorphic-footer"
                data-testid="dialog-layout-footer"
                asChild={
                  /** Keep the close control on a caller-rendered footer. */
                  (getProps) => <footer {...getProps({ ref: captureLayoutChild })} />
                }
              >
                <DialogCloseTrigger
                  asChild={
                    /** Keep the primitive's close behavior on a caller-rendered button. */
                    (getProps) => <button {...getProps()} data-testid="dialog-child-close" />
                  }
                >
                  Close polymorphic Dialog
                </DialogCloseTrigger>
                <DialogCloseTrigger
                  as="a"
                  href="#dialog-close"
                  ref={captureSelectedClose}
                  class="dialog-polymorphic-close"
                  data-testid="dialog-selected-close"
                >
                  Close selected Dialog
                </DialogCloseTrigger>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    </>
  );
}

const meta = {
  title: 'Components/Dialog Polymorphic',
  component: DialogPolymorphicExample,
} satisfies Meta<typeof DialogPolymorphicExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
