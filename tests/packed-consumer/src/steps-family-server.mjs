import assert from 'node:assert/strict';
import { Steps, StepsPropsProvider, useSteps, useStepsContext } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { JSDOM } from 'jsdom';

/** Read the installed machine inside the compound root. */
function renderProbe() {
  const machine = useStepsContext();
  return machine().value + ':ready';
}

/** Render one installed item with its default number and label. */
function renderItem(index, title) {
  return createComponent(Steps.Item, {
    value: `step-${index}`,
    title,
    /** Keep the trigger and separator inside the item context. */
    get children() {
      return [
        createComponent(Steps.Trigger, {
          /** Render the default indicator and accessible title together. */
          get children() {
            return [
              createComponent(Steps.Indicator, {}),
              createComponent(Steps.Title, { children: title }),
            ];
          },
        }),
        createComponent(Steps.Separator, {}),
      ];
    },
  });
}

/** Compose the public namespace under the installed external machine. */
function renderParts() {
  return [
    createComponent(Steps.List, {
      /** Construct item contexts beneath the list. */
      get children() {
        return [renderItem(0, 'Install'), renderItem(1, 'Finish')];
      },
    }),
    createComponent(Steps.Content, { value: 'step-0', children: 'First installed panel' }),
    createComponent(Steps.Content, { value: 'step-1', children: 'Second installed panel' }),
    createComponent(Steps.CompletedContent, { children: 'All done' }),
    createComponent(Steps.PrevTrigger, { children: 'Previous' }),
    createComponent(Steps.NextTrigger, { children: 'Continue' }),
    createComponent(renderProbe, {}),
  ];
}

/** Supply the machine and presentation defaults from the installed package. */
function renderExternalRoot() {
  const machine = useSteps({
    items: [{ value: 'step-0' }, { value: 'step-1' }],
    defaultValue: 'step-0',
    orientation: 'vertical',
  });
  return createComponent(StepsPropsProvider, {
    value: { size: 'sm', variant: 'subtle' },
    /** Preserve defaults when rendering the caller-owned root. */
    get children() {
      return createComponent(Steps.RootProvider, {
        value: machine,
        /** Keep every compound part under the primitive's root context. */
        get children() {
          return renderParts();
        },
      });
    },
  });
}

/** Render the separate consumer's published server entry with packaged CSS. */
function renderInstalledSteps() {
  return renderToString(
    /** Create the machine inside the server request's Solid owner. */
    () => renderExternalRoot(),
  );
}

/** Verify the primitive's installed tab, panel, and disabled navigation attributes. */
function verifyServerRelationships(markup) {
  const window = new JSDOM(markup).window;
  try {
    const document = window.document;
    const list = document.querySelector('[data-steps-list]');
    const triggers = [...document.querySelectorAll('[data-steps-trigger]')];
    const panels = [...document.querySelectorAll('[data-steps-content]')];
    assert.equal(list?.getAttribute('role'), 'tablist');
    assert.equal(list?.getAttribute('aria-orientation'), 'vertical');
    assert.equal(triggers.length, 2);
    assert.equal(panels.length, 3);
    for (const [index, trigger] of triggers.entries()) {
      const panel = panels[index];
      assert.ok(panel);
      assert.ok(trigger.id);
      assert.ok(panel.id);
      assert.equal(trigger.getAttribute('role'), 'tab');
      assert.equal(trigger.getAttribute('aria-controls'), panel.id);
      assert.equal(panel.getAttribute('role'), 'tabpanel');
      assert.equal(panel.getAttribute('aria-labelledby'), trigger.id);
    }
    assert.equal(triggers[0].getAttribute('aria-selected'), 'true');
    assert.equal(triggers[1].getAttribute('aria-selected'), 'false');
    assert.equal(
      document.querySelector('[data-steps-previous-trigger]')?.hasAttribute('disabled'),
      true,
    );
    assert.equal(
      document.querySelector('[data-steps-next-trigger]')?.hasAttribute('disabled'),
      false,
    );
  } finally {
    window.close();
  }
}

const markup = renderInstalledSteps();
assert.match(markup, /lui-steps__root/);
assert.match(markup, /lui-steps__indicator/);
assert.match(markup, /data-orientation="vertical"/);
assert.match(markup, /First installed panel/);
assert.match(markup, /step-0:ready/);
verifyServerRelationships(markup);
console.log('Packed external Steps server rendering passed.');
