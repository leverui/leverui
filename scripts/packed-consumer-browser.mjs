import assert from 'node:assert/strict';
import { withPackedPreview } from './packed-consumer-preview.mjs';
import { verifyPackedTabs } from './packed-consumer-tabs.mjs';
import { verifyPackedSteps } from './packed-consumer-steps.mjs';
import { verifyPackedLayout } from './packed-consumer-layout.mjs';
import { verifyPackedSplitter } from './packed-consumer-splitter.mjs';
import { verifyPackedAvatar } from './packed-consumer-avatar.mjs';
import { verifyPackedBadge } from './packed-consumer-badge.mjs';
import { verifyPackedAlert } from './packed-consumer-alert.mjs';
import { verifyPackedCheckmark } from './packed-consumer-checkmark.mjs';
import { verifyPackedEmptyState } from './packed-consumer-empty-state.mjs';
import { verifyPackedProgress } from './packed-consumer-progress.mjs';
import { verifyPackedProgressCircle } from './packed-consumer-progress-circle.mjs';
import { verifyPackedRadiomark } from './packed-consumer-radiomark.mjs';
import { verifyPackedSkeleton } from './packed-consumer-skeleton.mjs';
import { verifyPackedBlockquote } from './packed-consumer-blockquote.mjs';
import { verifyPackedCard } from './packed-consumer-card.mjs';
import { verifyPackedCode } from './packed-consumer-code.mjs';
import { verifyPackedCodeBlock } from './packed-consumer-code-block.mjs';
import { verifyPackedColorSwatch } from './packed-consumer-color-swatch.mjs';
import { verifyPackedDataList } from './packed-consumer-data-list.mjs';
import { verifyPackedHighlight } from './packed-consumer-highlight.mjs';
import { verifyPackedIcon } from './packed-consumer-icon.mjs';
import { verifyPackedKbd } from './packed-consumer-kbd.mjs';
import { verifyPackedLink } from './packed-consumer-link.mjs';
import { verifyPackedContent } from './packed-consumer-content.mjs';
import { verifyPackedClientOnly } from './packed-consumer-client-only.mjs';
import { verifyPackedEnvironment } from './packed-consumer-environment.mjs';
import { verifyPackedFor } from './packed-consumer-for.mjs';
import { verifyPackedLocale } from './packed-consumer-locale.mjs';
import { verifyPackedPortal } from './packed-consumer-portal.mjs';
import { verifyPackedPresence } from './packed-consumer-presence.mjs';
import { verifyPackedShow } from './packed-consumer-show.mjs';
import { verifyPackedVisuallyHidden } from './packed-consumer-visually-hidden.mjs';
import { verifyPackedInteractions } from './packed-consumer-interactions.mjs';
import { verifyPackedFields } from './packed-consumer-fields.mjs';
import { verifyPackedCheckboxCard } from './packed-consumer-checkbox-card.mjs';
import { verifyPackedCombobox } from './packed-consumer-combobox.mjs';
import { verifyPackedAccordion } from './packed-consumer-accordion.mjs';
import { verifyPackedActionBar } from './packed-consumer-action-bar.mjs';
import { verifyPackedCollapsible } from './packed-consumer-collapsible.mjs';

const consumerDirectory = process.argv[2];
assert.ok(consumerDirectory, 'Pass the packed consumer directory.');

/** Read a rendered element's computed background color in Chromium. */
function backgroundColor(element) {
  return getComputedStyle(element).backgroundColor;
}

/** Verify bundled components use the consumer stylesheet in a real browser. */
async function verifyBrowser(page, url) {
  await page.locator('#packed-button').waitFor();
  assert.equal(await page.locator('#packed-box').evaluate(backgroundColor), 'rgb(242, 239, 255)');
  assert.deepEqual(
    await page.locator('#packed-box').evaluate(
      /** Read only the public Box hook and the consumer's own class. */
      (element) => [...element.classList],
    ),
    ['lui-box', 'packed-box-surface'],
  );
  assert.equal(
    await page.locator('#packed-escaped-box').evaluate(
      /** Read the escaped utility's computed spacing. */
      (element) => getComputedStyle(element).padding,
    ),
    '37px',
  );
  assert.equal(await page.locator('#packed-button').evaluate(backgroundColor), 'rgb(98, 84, 199)');
  assert.equal(
    await page.locator('#packed-icon-link').evaluate(
      /** Keep the installed IconButton's selected native anchor. */
      (element) => element.tagName,
    ),
    'A',
  );
  assert.equal(await page.locator('#packed-icon-link').getAttribute('href'), '#packed-icon-link');
  assert.equal(
    await page.locator('#packed-close-span').evaluate(
      /** Keep the installed CloseButton's selected native span. */
      (element) => element.tagName,
    ),
    'SPAN',
  );
  assert.equal(await page.locator('#packed-close-span').getAttribute('role'), 'button');
  assert.equal(
    await page.locator('#packed-spinner').evaluate(
      /** Read the packaged Spinner's recipe size. */
      (element) => getComputedStyle(element).width,
    ),
    '16px',
  );
  assert.equal(await page.locator('#packed-loader').textContent(), 'Working');
  assert.equal(
    await page.locator('#packed-loader-overlay').evaluate(
      /** Measure the packaged overlay inside its relative host. */
      (element) => getComputedStyle(element).width,
    ),
    '120px',
  );
  await verifyPackedTabs(page);
  await verifyPackedSteps(page);
  await verifyPackedInteractions(page);
  await verifyPackedCheckboxCard(page);
  await verifyPackedCombobox(page);
  await verifyPackedAccordion(page);
  await verifyPackedActionBar(page);
  await verifyPackedCollapsible(page);
  await verifyPackedFields(page);
  await page.goto(new URL('layout.html', url).href);
  await verifyPackedLayout(page);
  await verifyPackedSplitter(page);
  await page.goto(new URL('presentation.html', url).href);
  await verifyPackedAvatar(page);
  await verifyPackedBadge(page);
  await verifyPackedBlockquote(page);
  await verifyPackedCard(page);
  await verifyPackedCode(page);
  await verifyPackedCodeBlock(page);
  await verifyPackedColorSwatch(page);
  await verifyPackedDataList(page);
  await verifyPackedHighlight(page);
  await verifyPackedIcon(page);
  await verifyPackedKbd(page);
  await verifyPackedLink(page);
  await page.goto(new URL('content.html', url).href);
  await verifyPackedContent(page);
  await page.goto(new URL('utility.html', url).href);
  await verifyPackedClientOnly(page);
  await verifyPackedEnvironment(page);
  await verifyPackedFor(page);
  await verifyPackedLocale(page);
  await verifyPackedPortal(page);
  await verifyPackedPresence(page);
  await verifyPackedShow(page);
  await verifyPackedVisuallyHidden(page);
  await page.goto(new URL('alert.html', url).href);
  await verifyPackedAlert(page);
  await page.goto(new URL('checkmark.html', url).href);
  await verifyPackedCheckmark(page);
  await page.goto(new URL('empty-state.html', url).href);
  await verifyPackedEmptyState(page);
  await page.goto(new URL('progress.html', url).href);
  await verifyPackedProgress(page);
  await page.goto(new URL('progress-circle.html', url).href);
  await verifyPackedProgressCircle(page);
  await page.goto(new URL('radiomark.html', url).href);
  await verifyPackedRadiomark(page);
  await page.goto(new URL('skeleton.html', url).href);
  await verifyPackedSkeleton(page);
}

await withPackedPreview(consumerDirectory, '/', verifyBrowser);
console.log('Packed consumer browser passed.');
