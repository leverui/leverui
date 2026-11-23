import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Steps,
  Text,
  type StepsNavigationBlockedDetails,
} from '../../src';
import './steps-validation.css';

const fields = [
  { title: 'Name', description: 'Enter your name' },
  { title: 'Email', description: 'Enter your email' },
  { title: 'Password', description: 'Create a password' },
] as const;

const errorStyle = {
  color: 'var(--lui-colors-red-fg)',
  'margin-top': 'var(--lui-spacing-3)',
} as const;

/** Validate each registration field before advancing to the next step. */
export function StepsValidation(): JSX.Element {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);

  /** Mark each step invalid until its field passes the rule. */
  const items = createMemo(() => [
    { value: 'step-0', invalid: name().trim().length === 0 },
    { value: 'step-1', invalid: !email().includes('@') },
    { value: 'step-2', invalid: password().length < 8 },
  ]);

  /** Explain which step blocked advancement. */
  function showInvalid(details: StepsNavigationBlockedDetails): void {
    setError(`Step ${details.index + 1} is invalid`);
  }

  /** Update the name and clear stale validation feedback. */
  function updateName(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setName(event.currentTarget.value);
    setError(null);
  }

  /** Update the email and clear stale validation feedback. */
  function updateEmail(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setEmail(event.currentTarget.value);
    setError(null);
  }

  /** Update the password and clear stale validation feedback. */
  function updatePassword(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    setPassword(event.currentTarget.value);
    setError(null);
  }

  return (
    <Steps.Root items={items()} linear onNavigationBlocked={showInvalid}>
      <Steps.List>
        <For each={fields}>
          {
            /** Bind each registration field to its machine index. */
            (field, index) => (
              <Steps.Item value={`step-${index()}`}>
                <Steps.Trigger>
                  <Steps.Indicator />
                  <Box>
                    <Steps.Title>{field.title}</Steps.Title>
                    <Steps.Description>{field.description}</Steps.Description>
                  </Box>
                </Steps.Trigger>
                <Steps.Separator />
              </Steps.Item>
            )
          }
        </For>
      </Steps.List>
      <Steps.Content value="step-0" class="steps-validation-content">
        <Input placeholder="Enter your name" value={name()} onInput={updateName} />
        <Show when={error()}>
          <Box textStyle="sm" style={errorStyle}>
            {error()}
          </Box>
        </Show>
      </Steps.Content>
      <Steps.Content value="step-1" class="steps-validation-content">
        <Input type="email" placeholder="email@example.com" value={email()} onInput={updateEmail} />
        <Show when={error()}>
          <Box textStyle="sm" style={errorStyle}>
            {error()}
          </Box>
        </Show>
      </Steps.Content>
      <Steps.Content value="step-2" class="steps-validation-content">
        <Input
          type="password"
          placeholder="Enter password"
          value={password()}
          onInput={updatePassword}
        />
        <Show when={error()}>
          <Box textStyle="sm" style={errorStyle}>
            {error()}
          </Box>
        </Show>
      </Steps.Content>
      <Steps.CompletedContent>
        <Text>Registration complete!</Text>
      </Steps.CompletedContent>
      <ButtonGroup size="sm" variant="outline" style={{ 'margin-top': 'var(--lui-spacing-4)' }}>
        <Steps.PrevTrigger
          asChild={
            /** Forward the validated guide's previous-step action. */
            (getProps) => <Button {...getProps()}>Back</Button>
          }
        />
        <Steps.NextTrigger
          asChild={
            /** Forward the validated guide's next-step action. */
            (getProps) => <Button {...getProps()}>Next</Button>
          }
        />
      </ButtonGroup>
    </Steps.Root>
  );
}
