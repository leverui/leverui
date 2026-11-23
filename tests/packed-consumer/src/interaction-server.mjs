import assert from 'node:assert/strict';
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxLabel,
  CheckboxRoot,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Input,
  Portal,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  requiredAttribute,
  requiredBooleanAttribute,
  requiredElement,
  requiredPart,
} from './interaction-server-tags.mjs';

/** Create compound children only after their parent's context exists. */
function withChildren(Component, props, renderChildren) {
  return createComponent(Component, {
    ...props,
    /** Resolve the compound parts beneath the owning context. */
    get children() {
      return renderChildren();
    },
  });
}

/** Render a package component in one isolated server owner. */
function renderInstalled(renderChildren) {
  return renderToString(renderChildren);
}

/** Render and inspect the installed Input's native initial state. */
function verifyInput() {
  /** Create an Input through the installed component entry. */
  function renderInput() {
    return createComponent(Input, { 'aria-label': 'Packed name', defaultValue: 'draft' });
  }
  const markup = renderInstalled(renderInput);
  const input = requiredElement(markup, 'input', 'aria-label', 'Packed name');
  assert.equal(requiredAttribute(input, 'value'), 'draft');
  assert.match(input, /lui-input/);
}

/** Create the visible and native Checkbox parts under one primitive root. */
function renderCheckboxParts() {
  return [
    createComponent(CheckboxControl, {}),
    createComponent(CheckboxLabel, { children: 'Packed consent' }),
    createComponent(CheckboxHiddenInput, {}),
  ];
}

/** Render and inspect installed Checkbox state and label association. */
function verifyCheckbox() {
  /** Create the machine through the installed component entry. */
  function renderCheckbox() {
    return withChildren(
      CheckboxRoot,
      { defaultChecked: true, name: 'packed-choice', value: 'yes' },
      renderCheckboxParts,
    );
  }
  const markup = renderInstalled(renderCheckbox);
  assert.match(markup, /Packed consent/);
  const root = requiredPart(markup, 'checkbox', 'root');
  const label = requiredPart(markup, 'checkbox', 'label');
  const input = requiredElement(markup, 'input', 'name', 'packed-choice');
  assert.equal(requiredAttribute(root, 'data-state'), 'checked');
  assert.equal(requiredAttribute(root, 'for'), requiredAttribute(input, 'id'));
  assert.equal(requiredAttribute(input, 'type'), 'checkbox');
  assert.equal(requiredAttribute(input, 'value'), 'yes');
  requiredBooleanAttribute(input, 'checked');
  assert.equal(requiredAttribute(input, 'aria-labelledby'), requiredAttribute(label, 'id'));
}

/** Create Dialog content with its accessible name and description. */
function renderDialogContentParts() {
  return [
    createComponent(DialogTitle, { children: 'Packed dialog' }),
    createComponent(DialogDescription, { children: 'Installed portal and focus' }),
  ];
}

/** Keep Dialog content under the primitive's positioner context. */
function renderDialogContent() {
  return withChildren(DialogContent, {}, renderDialogContentParts);
}

/** Create the positioned Dialog child beneath the public portal. */
function renderDialogPositioner() {
  return withChildren(DialogPositioner, {}, renderDialogContent);
}

/** Create the trigger and server-inline portal beneath one Dialog root. */
function renderDialogParts() {
  return [
    createComponent(DialogTrigger, { children: 'Open packed dialog' }),
    withChildren(Portal, {}, renderDialogPositioner),
  ];
}

/** Render and inspect an initially open installed Dialog. */
function verifyDialog() {
  /** Create the open the primitive machine through the installed component entry. */
  function renderDialog() {
    return withChildren(DialogRoot, { defaultOpen: true }, renderDialogParts);
  }
  const markup = renderInstalled(renderDialog);
  assert.match(markup, /Packed dialog/);
  assert.match(markup, /Installed portal and focus/);
  const trigger = requiredPart(markup, 'dialog', 'trigger');
  const content = requiredPart(markup, 'dialog', 'content');
  const title = requiredPart(markup, 'dialog', 'title');
  const description = requiredPart(markup, 'dialog', 'description');
  assert.equal(requiredAttribute(content, 'role'), 'dialog');
  assert.equal(requiredAttribute(trigger, 'aria-controls'), requiredAttribute(content, 'id'));
  assert.equal(requiredAttribute(content, 'aria-labelledby'), requiredAttribute(title, 'id'));
  assert.equal(
    requiredAttribute(content, 'aria-describedby'),
    requiredAttribute(description, 'id'),
  );
}

/** Create Tabs triggers under the installed list context. */
function renderTabsTriggers() {
  return createComponent(TabsTrigger, { value: 'one', children: 'First packed tab' });
}

/** Create a selected trigger and panel under one Tabs machine. */
function renderTabsParts() {
  return [
    withChildren(TabsList, {}, renderTabsTriggers),
    createComponent(TabsContent, { value: 'one', children: 'First packed panel' }),
  ];
}

/** Render and inspect installed Tabs selection and ARIA associations. */
function verifyTabs() {
  /** Create the selected machine through the installed component entry. */
  function renderTabs() {
    return withChildren(TabsRoot, { defaultValue: 'one' }, renderTabsParts);
  }
  const markup = renderInstalled(renderTabs);
  assert.match(markup, /First packed tab/);
  assert.match(markup, /First packed panel/);
  const trigger = requiredPart(markup, 'tabs', 'trigger');
  const content = requiredPart(markup, 'tabs', 'content');
  assert.equal(requiredAttribute(trigger, 'aria-selected'), 'true');
  assert.equal(requiredAttribute(trigger, 'aria-controls'), requiredAttribute(content, 'id'));
  assert.equal(requiredAttribute(content, 'aria-labelledby'), requiredAttribute(trigger, 'id'));
}

verifyInput();
verifyCheckbox();
verifyDialog();
verifyTabs();
console.log('Packed interaction server rendering passed.');
