import { Field as PrimitiveField } from '../src/primitives/components/field';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxPropsProvider,
  CheckboxRoot,
  type CheckboxCheckedChangeDetails,
  type CheckboxCheckedState,
} from '../src';

/** Exercise Checkbox state, the primitive fields, forms, and changing CSS choices. */
function CheckboxContractExample(): JSX.Element {
  const [checked, setChecked] = createSignal<CheckboxCheckedState>(false);
  const [large, setLarge] = createSignal(false);
  const [changes, setChanges] = createSignal(0);

  /** Translate the primitive's checked-change details into a Solid signal. */
  function updateChecked(details: CheckboxCheckedChangeDetails): void {
    setChecked(details.checked);
    setChanges(changes() + 1);
  }

  /** Toggle inherited CSS size without remounting the controls. */
  function toggleSize(): void {
    setLarge(!large());
  }

  /** Record the actual native root passed to the consumer ref. */
  function markRoot(element: HTMLLabelElement): void {
    element.dataset.refTag = element.tagName.toLowerCase();
  }

  /** Record the ref supplied to a Lever UI part using asChild. */
  function markParentRef(element: HTMLElement): void {
    element.dataset.parentRef = 'true';
  }

  /** Record the ref supplied by the chosen native child. */
  function markChildRef(element: HTMLElement): void {
    element.dataset.childRef = 'true';
  }

  return (
    <>
      <div data-testid="checkbox-contract">
        <form data-testid="checkbox-form">
          <CheckboxPropsProvider value={{ size: large() ? 'lg' : 'sm', variant: 'solid' }}>
            <PrimitiveField.Root id="consent-field" required>
              <CheckboxRoot
                class="consumer-checkbox"
                ref={markRoot}
                checked={checked()}
                onCheckedChange={updateChecked}
                name="consent"
                value="yes"
                data-testid="controlled-root"
              >
                <CheckboxControl class="consumer-checkbox-control" data-testid="controlled-control">
                  <CheckboxIndicator class="consumer-checkbox-indicator" />
                </CheckboxControl>
                <CheckboxLabel class="consumer-checkbox-label">Consent</CheckboxLabel>
                <CheckboxHiddenInput data-testid="controlled-input" />
              </CheckboxRoot>
              <PrimitiveField.HelperText>Required choice</PrimitiveField.HelperText>
            </PrimitiveField.Root>
            <CheckboxRoot defaultChecked name="updates" value="yes" data-testid="default-root">
              <CheckboxControl data-testid="default-control" />
              <CheckboxLabel>Updates</CheckboxLabel>
              <CheckboxHiddenInput data-testid="default-input" />
            </CheckboxRoot>
            <CheckboxRoot checked="indeterminate" data-testid="mixed-root">
              <CheckboxControl data-testid="mixed-control" />
              <CheckboxLabel>Mixed</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
            <CheckboxRoot disabled data-testid="disabled-root">
              <CheckboxControl />
              <CheckboxLabel>Disabled</CheckboxLabel>
              <CheckboxHiddenInput data-testid="disabled-input" />
            </CheckboxRoot>
            <CheckboxRoot readOnly data-testid="readonly-root">
              <CheckboxControl />
              <CheckboxLabel>Read only</CheckboxLabel>
              <CheckboxHiddenInput data-testid="readonly-input" />
            </CheckboxRoot>
            <CheckboxRoot defaultChecked data-testid="unstyled-root">
              <CheckboxControl unstyled data-testid="unstyled-control" />
              <CheckboxLabel unstyled data-testid="unstyled-label">
                Unstyled
              </CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
            <CheckboxRoot defaultChecked>
              <CheckboxControl unstyled style={{ width: '40px' }} data-testid="custom-control" />
              <CheckboxLabel unstyled style={{ 'font-weight': '700' }} data-testid="custom-label">
                Custom parts
              </CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
            <CheckboxRoot defaultChecked data-testid="child-root">
              <CheckboxControl
                ref={markParentRef}
                style={{ width: '32px' }}
                asChild={
                  /** Render a native child with both ref owners and primitive props. */
                  (getProps) => (
                    <div {...getProps({ ref: markChildRef })} data-testid="child-control" />
                  )
                }
              />
              <CheckboxLabel
                ref={markParentRef}
                style={{ 'font-weight': 'bold' }}
                asChild={
                  /** Render a label child with its native and consumer props. */
                  (getProps) => (
                    <span {...getProps({ ref: markChildRef })} data-testid="child-label">
                      Child composition
                    </span>
                  )
                }
              />
              <CheckboxHiddenInput data-testid="child-input" />
            </CheckboxRoot>
          </CheckboxPropsProvider>
          <CheckboxRoot
            checked
            size={{ base: 'sm', md: 'lg' }}
            variant={{ base: 'solid', md: 'outline' }}
            data-testid="responsive-root"
          >
            <CheckboxControl data-testid="responsive-control" />
            <CheckboxLabel>Responsive choice</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        </form>
        <button type="button" onClick={toggleSize} data-testid="checkbox-size-toggle">
          Toggle size
        </button>
        <output data-testid="checkbox-state">{String(checked())}</output>
        <output data-testid="checkbox-changes">{changes()}</output>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Checkbox',
  component: CheckboxContractExample,
} satisfies Meta<typeof CheckboxContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};
