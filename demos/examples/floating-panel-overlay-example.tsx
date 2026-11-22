import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GripHorizontalIcon, XIcon } from '@lucide/solid';
import {
  Button,
  Field,
  FloatingPanel,
  IconButton,
  Input,
  Portal,
  Stack,
  createOverlay,
} from '../../src';

/** Submit the panel's contact form and close it. */
function PanelForm(props: { onClose: () => void }): JSX.Element {
  const [name, setName] = createSignal('');

  /** Keep the input in caller-owned Solid state. */
  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setName(event.currentTarget.value);
  }

  /** Report the entered name, reset the field, and close the panel. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    alert(`Hello ${name() || 'there'}!`);
    props.onClose();
    setName('');
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input value={name()} onInput={updateName} placeholder="Enter your name" />
        </Field.Root>
        <Button type="submit" size="sm" style={{ 'align-self': 'flex-start' }}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}

interface ContactPanelData {
  title: string;
  content: () => JSX.Element;
}

const floatingPanel = createOverlay<ContactPanelData>(
  /** Render one floating panel from the controller's injected overlay props. */
  (props) => (
    <FloatingPanel.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      onExitComplete={props.onExitComplete}
    >
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon />
                <FloatingPanel.Title>{props.title}</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger
                  asChild={
                    /** Apply the machine close props to its icon action. */
                    (getProps) => (
                      <IconButton
                        {...getProps()}
                        variant="ghost"
                        size="2xs"
                        aria-label="Close panel"
                      >
                        <XIcon />
                      </IconButton>
                    )
                  }
                />
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>{props.content()}</FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  ),
);

/** Open a contact panel programmatically with createOverlay. */
export function FloatingPanelOverlay(): JSX.Element {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={
          /** Open the contact panel imperatively through the overlay controller. */
          () =>
            void floatingPanel.open('panel', {
              title: 'Contact',
              content:
                /** Create the form inside the panel so it starts empty on each open. */
                () => (
                  <PanelForm
                    onClose={
                      /** Close the panel after its form submits. */
                      () => void floatingPanel.close('panel')
                    }
                  />
                ),
            })
        }
      >
        Open panel
      </Button>
      <floatingPanel.Viewport />
    </>
  );
}
