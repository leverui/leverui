import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
  useCheckbox,
} from '../index';
import { type JSX } from '@solidjs/web';

afterEach(cleanup);

/** Preserve the primitive's group behavior through two caller-owned native elements. */
async function verifiesChildRenderedRoots(): Promise<void> {
  let groupRef: Element | undefined;
  let rootRef: Element | undefined;

  /** Capture the parent group ref on the rendered section. */
  function captureGroup(element: Element): void {
    groupRef = element;
  }

  /** Capture the parent root ref on the rendered label. */
  function captureRoot(element: Element): void {
    rootRef = element;
  }

  render(
    /** Mount custom roots while the primitive owns their selection state. */
    () => (
      <>
        <CheckboxGroup
          name="options"
          data-testid="child-group"
          ref={captureGroup}
          defaultValue={['one']}
          asChild={
            /** Receive grouped state, classes, and descendants on a section. */
            (getProps) => <section {...getProps()} />
          }
        >
          <CheckboxRoot
            value="one"
            data-testid="child-root"
            ref={captureRoot}
            asChild={
              /** Receive the checkbox machine and descendants on a label. */
              (getProps) => <label {...getProps()} />
            }
          >
            <CheckboxControl />
            <CheckboxLabel>One</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </CheckboxGroup>
      </>
    ),
  );

  const group = screen.getByTestId('child-group');
  const root = screen.getByTestId('child-root');
  const input = screen.getByRole('checkbox', { name: 'One' }) as HTMLInputElement;
  expect(group.tagName).toBe('SECTION');
  expect(group.getAttribute('role')).toBe('group');
  expect(groupRef).toBe(group);
  expect(root.tagName).toBe('LABEL');
  expect(rootRef).toBe(root);
  expect(root.className).toContain('leverui-checkbox');
  expect(input.checked).toBe(true);
  fireEvent.click(input);
  await waitFor(
    /** Confirm the primitive updates the selected value under both child renderers. */
    () => expect(input.checked).toBe(false),
  );
}

it('preserves group and root behavior through asChild', verifiesChildRenderedRoots);

/** Preserve a caller-owned Checkbox machine through RootProvider asChild. */
async function verifiesProviderChild(): Promise<void> {
  let providerRef: Element | undefined;

  /** Record the element selected by the external machine's provider. */
  function captureProvider(element: Element): void {
    providerRef = element;
  }

  /** Create a machine under the Solid owner that renders its child. */
  function Example(): JSX.Element {
    const checkbox = useCheckbox({ defaultChecked: true });
    return (
      <>
        <CheckboxRootProvider
          value={checkbox}
          ref={captureProvider}
          data-testid="child-provider"
          asChild={
            /** Preserve the provider's native state on the chosen label. */
            (getProps) => <label {...getProps()} />
          }
        >
          <CheckboxControl />
          <CheckboxLabel>Provided child</CheckboxLabel>
          <CheckboxHiddenInput />
        </CheckboxRootProvider>
      </>
    );
  }

  render(Example);
  const root = screen.getByTestId('child-provider');
  const input = screen.getByRole('checkbox', { name: 'Provided child' }) as HTMLInputElement;
  expect(root.tagName).toBe('LABEL');
  expect(providerRef).toBe(root);
  expect(input.checked).toBe(true);
  fireEvent.click(input);
  await waitFor(
    /** Confirm the caller-owned machine still updates after child rendering. */
    () => expect(input.checked).toBe(false),
  );
}

it('preserves RootProvider behavior through asChild', verifiesProviderChild);
