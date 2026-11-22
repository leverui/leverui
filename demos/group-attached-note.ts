/** Explain native prop forwarding for a custom child inside an attached Group. */
export const groupAttachedNote = `**Note:** When composing custom components in an attached \`Group\`, forward their props to the native control.

\`\`\`tsx
import '@leverui/components/styles.css';
import { type JSX } from '@solidjs/web';
import { Button, Group, type ButtonProps } from '@leverui/components';

/** Forward button props so the custom control keeps its native behavior. */
function FocusButton(props: ButtonProps): JSX.Element {
  return <Button variant="outline" {...props}>Focus</Button>;
}

/** Attach a custom button to another control. */
export function GroupWithCustomButton(): JSX.Element {
  return (
    <Group attached>
      <FocusButton />
      <Button variant="outline">Two</Button>
    </Group>
  );
}
\`\`\``;
