import { type JSX } from '@solidjs/web';
import { MailIcon, SearchIcon, UserIcon } from '@lucide/solid';
import { Button, Group, Input, InputGroup, Kbd, NativeSelect } from '../../src';

/** Add the domain suffix inside the field border. */
export function InputEndText(): JSX.Element {
  return (
    <InputGroup endElement=".com">
      <Input placeholder="yoursite" />
    </InputGroup>
  );
}

/** Attach the domain suffix outside the field border. */
export function InputEndAddon(): JSX.Element {
  return (
    <InputGroup endAddon=".com">
      <Input placeholder="yoursite" />
    </InputGroup>
  );
}

/** Join an email field to an outline submit button. */
export function InputEndButton(): JSX.Element {
  return (
    <Group attached style={{ width: '100%', 'max-width': '24rem' }}>
      <Input style={{ flex: '1' }} placeholder="Enter your email" />
      <Button style={{ background: 'var(--lui-colors-bg-subtle)' }} variant="outline">
        Submit
      </Button>
    </Group>
  );
}

/** Place a mail symbol at the end of the input. */
export function InputEndIcon(): JSX.Element {
  return (
    <InputGroup endElement={<MailIcon />}>
      <Input placeholder="Email" />
    </InputGroup>
  );
}

/** Attach the URL prefix outside the input. */
export function InputStartAddon(): JSX.Element {
  return (
    <InputGroup startAddon="https://">
      <Input placeholder="yoursite.com" />
    </InputGroup>
  );
}

/** Attach currency and unit labels on both edges. */
export function InputStartAndEndAddon(): JSX.Element {
  return (
    <InputGroup startAddon="$" endAddon="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  );
}

/** Place currency and unit text inside the input edges. */
export function InputStartAndEndText(): JSX.Element {
  return (
    <InputGroup startElement="$" endElement="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  );
}

/** Combine an inline currency sign with an attached unit. */
export function InputStartElementEndAddon(): JSX.Element {
  return (
    <InputGroup startElement="$" endAddon="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  );
}

/** Place a user symbol before the username field. */
export function InputStartIcon(): JSX.Element {
  return (
    <InputGroup startElement={<UserIcon />}>
      <Input placeholder="Username" />
    </InputGroup>
  );
}

/** Reserve space for the long inline URL prefix. */
export function InputStartText(): JSX.Element {
  return (
    <InputGroup
      startElement="https://"
      startElementProps={{ style: { color: 'var(--lui-colors-fg-muted)' } }}
    >
      <Input style={{ 'padding-inline-start': '7ch' }} placeholder="yoursite.com" />
    </InputGroup>
  );
}

/** Show a search symbol and keyboard shortcut within one field. */
export function InputKbd(): JSX.Element {
  return (
    <InputGroup style={{ flex: 1 }} startElement={<SearchIcon />} endElement={<Kbd>⌘K</Kbd>}>
      <Input placeholder="Search contacts" />
    </InputGroup>
  );
}

/** Let the user choose the domain suffix inside the input group. */
function DomainSelect(): JSX.Element {
  return (
    <NativeSelect.Root
      size="xs"
      variant="plain"
      style={{ width: 'auto', 'margin-inline-end': '-0.25rem' }}
    >
      <NativeSelect.Field defaultValue=".com" style={{ 'font-size': 'var(--lui-font-sizes-sm)' }}>
        <option value=".com">.com</option>
        <option value=".org">.org</option>
        <option value=".net">.net</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

/** Pair an inline URL prefix with a selectable domain. */
export function InputSelect(): JSX.Element {
  return (
    <InputGroup style={{ flex: 1 }} startElement="https://" endElement={<DomainSelect />}>
      <Input
        style={{ 'padding-inline-start': '4.75em', 'padding-inline-end': '0' }}
        placeholder="yoursite.com"
      />
    </InputGroup>
  );
}
