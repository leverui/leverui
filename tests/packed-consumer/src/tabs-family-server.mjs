import assert from 'node:assert/strict';
import {
  Tabs,
  TabsContentGroup,
  TabsRootProvider,
  useTabs,
  useTabsContext,
} from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Read the installed machine context from a server child. */
function renderProbe() {
  const api = useTabsContext();
  return api().value;
}

/** Compose the installed Tabs namespace with its direct content-group export. */
function renderParts() {
  return [
    createComponent(Tabs.List, {
      'aria-label': 'Packed server family tabs',
      /** Create the trigger under its list context. */
      get children() {
        return createComponent(Tabs.Trigger, { value: 'one', children: 'First server tab' });
      },
    }),
    createComponent(TabsContentGroup, {
      /** Create the selected panel under its content group. */
      get children() {
        return createComponent(Tabs.Content, {
          value: 'one',
          children: 'First server panel',
        });
      },
    }),
    createComponent(renderProbe, {}),
  ];
}

/** Create the external machine inside the installed provider. */
function renderExternalRoot() {
  const machine = useTabs({ defaultValue: 'one' });
  return createComponent(TabsRootProvider, {
    value: machine,
    /** Preserve the machine context while constructing compound children. */
    get children() {
      return renderParts();
    },
  });
}

/** Render the external machine from the installed server entry. */
function renderInstalledTabs() {
  return renderToString(
    /** Establish the provider before creating the machine. */
    () => renderExternalRoot(),
  );
}

const markup = renderInstalledTabs();
assert.match(markup, /leverui-tabs__root/);
assert.match(markup, /leverui-tabs__contentGroup/);
assert.match(markup, /aria-selected="true"/);
assert.match(markup, /First server panel/);
console.log('Packed external Tabs server rendering passed.');
