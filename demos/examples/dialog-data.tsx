import { type JSX } from '@solidjs/web';
import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Portal,
  Textarea,
  VStack,
} from '../../src';
import './dialog-utilities.css';

/** Show the status, assignee, due date, and note input. */
export function DialogDatalist(): JSX.Element {
  return (
    <VStack style={{ 'align-items': 'start' }}>
      <Dialog.Root>
        <Dialog.Trigger
          asChild={
            /** Open the task details from its outline button. */
            (getProps) => (
              <Button {...getProps()} variant="outline">
                Open dialog
              </Button>
            )
          }
        />
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Prepare the August release</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body class="example-dialog-body-bottom">
                <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemLabel>Status</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Badge colorPalette="green">Completed</Badge>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Assigned to</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <HStack>
                        <Avatar.Root size="xs">
                          <Avatar.Image src="/demo-images/avatars/avatar-1.webp" />
                          <Avatar.Fallback name="Mara Ellison" />
                        </Avatar.Root>
                        Mara Ellison
                      </HStack>
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Due date</DataList.ItemLabel>
                    <DataList.ItemValue>12th August 2024</DataList.ItemValue>
                  </DataList.Item>
                </DataList.Root>
                <Textarea
                  placeholder="Add a note"
                  style={{ 'margin-top': 'var(--leverui-spacing-8)' }}
                />
              </Dialog.Body>
              <Dialog.CloseTrigger
                asChild={
                  /** Preserve close behavior on the CloseButton. */
                  (getProps) => <CloseButton {...getProps()} size="sm" />
                }
              />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}
