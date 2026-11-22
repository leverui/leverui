import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { Accordion, Field, Input, TreeView, createTreeCollection } from '../index';

afterEach(cleanup);

/** Read the Accordion item's `expanded` flag from a part's untyped render state. */
function isExpanded(state: unknown): boolean {
  return (
    typeof state === 'object' && state !== null && 'expanded' in state && state.expanded === true
  );
}

/** Compose an Accordion whose item, trigger, and body use the primitive's `render` prop. */
function RenderedAccordion(): JSX.Element {
  return (
    <Accordion.Root collapsible>
      <Accordion.Item
        value="first"
        render={
          /** Read the item's live state while keeping its children. */
          (props, state) => (
            <article
              {...props()}
              data-testid="rendered-item"
              data-expanded={isExpanded(state()) ? 'yes' : 'no'}
            />
          )
        }
      >
        <Accordion.ItemTrigger
          render={
            /** Spread the primitive's props onto a caller-owned button, merging a class. */
            (props) => (
              <button {...props({ class: 'caller-trigger' })} data-testid="rendered-trigger">
                Toggle
              </button>
            )
          }
        />
        <Accordion.ItemContent>
          <Accordion.ItemBody
            render={
              /** Render Lever's native body part as a section. */
              (props) => <section {...props()} data-testid="rendered-body" />
            }
          >
            Panel
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/** Keep the primitive's behavior, Lever's classes, children, and live state through `render`. */
async function verifiesRenderedAccordion(): Promise<void> {
  render(
    /** Mount the rendered parts under one machine. */
    () => <RenderedAccordion />,
  );
  const item = screen.getByTestId('rendered-item');
  const trigger = screen.getByTestId('rendered-trigger');
  expect(item.tagName).toBe('ARTICLE');
  expect(item).toHaveClass('leverui-accordion__item');
  expect(item).toHaveAttribute('data-expanded', 'no');
  expect(trigger.tagName).toBe('BUTTON');
  expect(trigger).toHaveClass('caller-trigger');
  expect(trigger).toHaveClass('leverui-accordion__itemTrigger');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).not.toHaveAttribute('render');
  // Zag's Accordion acts on a click once its trigger has focus, as in a browser.
  trigger.focus();
  fireEvent.click(trigger);
  await waitFor(
    /** Wait for the machine to publish the open state through props and state. */
    () => expect(trigger).toHaveAttribute('aria-expanded', 'true'),
  );
  expect(item).toHaveAttribute('data-expanded', 'yes');
  const body = screen.getByTestId('rendered-body');
  expect(body.tagName).toBe('SECTION');
  expect(body).toHaveClass('leverui-accordion__itemBody');
  expect(body).toHaveTextContent('Panel');
}

it(
  'renders the primitive and Lever-native parts through the render prop',
  verifiesRenderedAccordion,
);

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

const collection = createTreeCollection<FileNode>({
  nodeToValue:
    /** Use each file's id as its tree value. */
    (node) => node.id,
  nodeToString:
    /** Use each file's name as its text. */
    (node) => node.name,
  rootNode: { id: 'root', name: 'Files', children: [{ id: 'readme', name: 'README.md' }] },
});

/** Render a tree row through `render` so the primitive's row keeps its grid semantics. */
function verifiesRenderedTreeRow(): void {
  render(
    /** Mount one leaf whose row is caller-rendered. */
    () => (
      <TreeView.Root collection={collection}>
        <TreeView.Tree>
          <TreeView.Node<FileNode>
            render={({ node }) => (
              <TreeView.Item
                render={
                  /** Render the row as a list item element. */
                  (props) => <li {...props()} data-testid="rendered-row" />
                }
              >
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )}
          />
        </TreeView.Tree>
      </TreeView.Root>
    ),
  );
  const row = screen.getByTestId('rendered-row');
  expect(row.tagName).toBe('LI');
  expect(row).toHaveAttribute('role', 'row');
  expect(row).toHaveClass('leverui-tree-view__item');
  expect(row.querySelector('[role="gridcell"]')).toHaveTextContent('README.md');
}

it('renders a TreeView row through the render prop', verifiesRenderedTreeRow);

/** Keep the Field root observer and consumer ref when the root uses `render`. */
async function verifiesRenderedFieldRoot(): Promise<void> {
  let rootElement: Element | undefined;
  render(
    /** Mount a rendered Field root with helper text. */
    () => (
      <Field.Root
        ref={(element: Element) => {
          rootElement = element;
        }}
        render={
          /** Render the root as a section. */
          (props) => <section {...props()} data-testid="rendered-field" />
        }
      >
        <Field.Label>Name</Field.Label>
        <Input />
        <Field.HelperText>Your full name</Field.HelperText>
      </Field.Root>
    ),
  );
  const root = screen.getByTestId('rendered-field');
  expect(root.tagName).toBe('SECTION');
  expect(root).toHaveClass('leverui-field__root');
  expect(rootElement).toBe(root);
  const input = screen.getByRole('textbox', { name: 'Name' });
  const helper = screen.getByText('Your full name');
  await waitFor(
    /** Wait for the primitive's root observer to connect the helper description. */
    () => expect(input.getAttribute('aria-describedby')).toContain(helper.id),
  );
}

it('keeps the Field observer and ref on a rendered root', verifiesRenderedFieldRoot);
