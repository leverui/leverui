import { Repeat } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { AspectRatio, Button, CloseButton, Dialog, Portal } from '../../src';
import './dialog-utilities.css';

/** Open a second modal from inside the first modal's footer. */
export function DialogNested(): JSX.Element {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="md">
              Open
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Sharing settings</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Repeat count={2}>
                {() => (
                  <p>
                    Anyone you invite to this project can open its files and leave comments. Editors
                    can also add, rename, and delete files. You can change a person's role at any
                    time from the members list. When you remove someone, they lose access right
                    away, but their comments stay. Files you delete go to the trash and stay there
                    for 30 days. After that they are removed for good and cannot be restored. Each
                    file keeps a history of changes, so you can go back to an earlier version.
                    Contact support if you need help with your plan.
                  </p>
                )}
              </Repeat>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline">Learn more</Button>
              <Dialog.Root>
                <Dialog.Trigger
                  asChild={
                    /** Open the nested modal from the solid action button. */
                    (getProps) => <Button {...getProps()}>Open nested</Button>
                  }
                />
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>More about roles</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <p>
                          Viewers can open files and read comments, but they cannot change anything.
                          Commenters can also leave notes on any file. Editors can add, rename,
                          move, and delete files. Admins can do all of that, and they can also
                          invite people and change roles. Every project needs at least one admin.
                          You can see each person's role next to their name in the members list.
                          Role changes apply as soon as you save them. People are told by email when
                          their role changes.
                        </p>
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** Position the close control beside the video's modal surface. */
export function DialogCloseOutside(): JSX.Element {
  return (
    <Dialog.Root placement="center">
      <Dialog.Trigger
        asChild={
          /** Forward trigger behavior to the outline button. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Open dialog
            </Button>
          )
        }
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body class="example-dialog-body-top">
              <Dialog.Title>Video preview</Dialog.Title>
              <Dialog.Description class="example-dialog-description-gap">
                This dialog shows a short line of text with a video below it.
              </Dialog.Description>
              <AspectRatio ratio={4 / 3} class="example-dialog-video">
                <iframe title="Sample video" src="/demo-embeds/video.html" allowfullscreen />
              </AspectRatio>
            </Dialog.Body>
            <Dialog.CloseTrigger
              class="example-dialog-close-outside"
              asChild={
                /** Draw the close button just outside the content surface. */
                (getProps) => <CloseButton {...getProps()} size="sm" />
              }
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
