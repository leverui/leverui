import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import { CodeBlock } from '../index';

/** Preserve a user-expanded block while source and limit props change. */
function verifiesManualCollapseState(): void {
  const [code, setCode] = createSignal('one\ntwo\nthree');
  const [maxLines, setMaxLines] = createSignal(2);

  /** Keep the root mounted while the source and line limit change. */
  function Example(): JSX.Element {
    return (
      <>
        <CodeBlock.Root code={code()} maxLines={maxLines()}>
          <CodeBlock.CollapseTrigger data-testid="manual-collapse">
            Toggle
          </CodeBlock.CollapseTrigger>
          <CodeBlock.Content data-testid="manual-content">
            <CodeBlock.CodeText data-testid="manual-code" />
          </CodeBlock.Content>
        </CodeBlock.Root>
      </>
    );
  }

  const view = render(
    /** Mount one block whose uncontrolled state must survive prop updates. */
    () => <Example />,
  );
  expect(screen.getByTestId('manual-content').getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(screen.getByTestId('manual-collapse'));
  expect(screen.getByTestId('manual-content').getAttribute('aria-expanded')).toBe('true');
  setCode('one\ntwo\nthree\nfour');
  flush();
  setMaxLines(1);
  flush();
  expect(screen.getByTestId('manual-code').textContent).toBe('one\ntwo\nthree\nfour');
  expect(screen.getByTestId('manual-content').getAttribute('aria-expanded')).toBe('true');
  view.unmount();
}

test('manual Code Block expansion survives source and limit changes', verifiesManualCollapseState);

/** Keep a custom content ID and the trigger relationship reactive together. */
function verifiesContentId(): void {
  const [contentId, setContentId] = createSignal('custom-content');

  /** Apply the ID to the root before either compound part renders. */
  function Example(): JSX.Element {
    return (
      <>
        <CodeBlock.Root code="ready" contentId={contentId()}>
          <CodeBlock.CollapseTrigger data-testid="id-collapse">Toggle</CodeBlock.CollapseTrigger>
          <CodeBlock.Content data-testid="id-content">
            <CodeBlock.CodeText />
          </CodeBlock.Content>
        </CodeBlock.Root>
      </>
    );
  }

  const view = render(
    /** Mount a header control before the content it identifies. */
    () => <Example />,
  );
  expect(screen.getByTestId('id-content').id).toBe('custom-content');
  expect(screen.getByTestId('id-collapse').getAttribute('aria-controls')).toBe('custom-content');
  setContentId('updated-content');
  flush();
  expect(screen.getByTestId('id-content').id).toBe('updated-content');
  expect(screen.getByTestId('id-collapse').getAttribute('aria-controls')).toBe('updated-content');
  view.unmount();
}

test('custom Code Block content IDs stay linked to the trigger', verifiesContentId);

/** Preserve a consumer label as it changes and disclosure state toggles. */
function verifiesReactiveCollapseLabel(): void {
  const [label, setLabel] = createSignal('Show source');

  /** Read the current consumer label without recreating the native trigger. */
  function Example(): JSX.Element {
    return (
      <>
        <CodeBlock.Root code={'one\ntwo'} maxLines={1}>
          <CodeBlock.CollapseTrigger aria-label={label()} data-testid="label-collapse">
            Toggle
          </CodeBlock.CollapseTrigger>
          <CodeBlock.Content>Source</CodeBlock.Content>
        </CodeBlock.Root>
      </>
    );
  }

  const view = render(
    /** Mount the labelled trigger and keep its root stable. */
    () => <Example />,
  );
  const trigger = screen.getByTestId('label-collapse');
  expect(trigger.getAttribute('aria-label')).toBe('Show source');
  setLabel('Toggle source');
  flush();
  expect(trigger.getAttribute('aria-label')).toBe('Toggle source');
  fireEvent.click(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(trigger.getAttribute('aria-label')).toBe('Toggle source');
  view.unmount();
}

test(
  'Code Block collapse labels remain reactive and consumer-owned',
  verifiesReactiveCollapseLabel,
);
