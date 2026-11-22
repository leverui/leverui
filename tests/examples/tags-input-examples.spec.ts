import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'disabled',
  'editable',
  'invalid',
  'read-only',
  'validation',
  'blur-behavior',
  'clear',
  'colors',
  'combobox',
  'delimiter',
  'field',
  'form',
  'max',
  'paste',
  'sizes',
  'store',
  'variants',
  'long-tags',
  'explorer',
  'sanitized-value',
] as const;

const storyBrand = 'Lever UI';

/** Open one curated Tags Input story by its export name. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-tags-input--${id}`);
}

/** Read the visible machine item text in the current story. */
function tagText(page: Page) {
  return page.locator('.leverui-tags-input__itemText');
}

/** Require all 22 examples to render their input control. */
async function verifiesInventory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await openStory(page, id);
    await expect(page.locator('[data-tags-input-root]').first()).toBeVisible();
  }
}

/** Match the initial copy and controlled updates of the basic examples. */
async function verifiesEntry({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand, 'TypeScript']);
  await page.getByPlaceholder('Add tag...').fill('Solid');
  await page.getByPlaceholder('Add tag...').press('Enter');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand, 'TypeScript', 'Solid']);

  await openStory(page, 'controlled');
  await page.getByPlaceholder('Add tag...').fill('Solid');
  await page.getByPlaceholder('Add tag...').press('Enter');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand, 'Solid']);

  await openStory(page, 'clear');
  await page.locator('[data-tags-input-clear-trigger]').click();
  await expect(tagText(page)).toHaveCount(0);
}

/** Confirm disabled, read-only, invalid, and editable states. */
async function verifiesStates({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'disabled');
  await expect(page.getByPlaceholder("Can't type here")).toBeDisabled();
  await openStory(page, 'read-only');
  await expect(page.getByPlaceholder('Read-only...')).toHaveAttribute('data-readonly', '');
  await expect(page.getByPlaceholder('Read-only...')).toBeDisabled();
  await openStory(page, 'invalid');
  await expect(page.getByText('Add at least three tags.')).toBeVisible();
  await openStory(page, 'editable');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand]);
}

/** Exercise validation, blur, delimiter, sanitization, and the guest cap. */
async function verifiesEntryRules({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'validation');
  const validated = page.getByPlaceholder('Add a tag...');
  await validated.fill('ab');
  await validated.press('Enter');
  await expect(tagText(page)).toHaveCount(2);
  await validated.fill('Solid');
  await validated.press('Enter');
  await expect(tagText(page)).toHaveCount(3);

  await openStory(page, 'blur-behavior');
  await page.getByPlaceholder('Type, then click away to add a tag...').fill('Solid');
  await page.getByText('Create a tag on blur').click();
  await expect(tagText(page)).toHaveText(['Solid']);

  await openStory(page, 'delimiter');
  await page.getByPlaceholder('Type ; or , to add a tag...').fill('Solid');
  await page.getByPlaceholder('Type ; or , to add a tag...').press(';');
  await expect(tagText(page)).toHaveText(['Solid']);

  await openStory(page, 'sanitized-value');
  await page.getByPlaceholder('Try " SolidJS "').fill(' Solid ');
  await page.getByPlaceholder('Try " SolidJS "').press('Enter');
  await expect(tagText(page)).toHaveText(['solid']);

  await openStory(page, 'max');
  const guests = page.getByPlaceholder('Add guests');
  for (const email of ['one@example.com', 'two@example.com', 'three@example.com']) {
    await guests.fill(email);
    await guests.press('Enter');
  }
  await expect(tagText(page)).toHaveCount(3);
  await expect(page.getByText('3 / 3 guests')).toBeVisible();
}

/** Check the color, size, variant, long-tag, field, and Explorer layouts. */
async function verifiesDisplay({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'colors');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand, 'TypeScript']);
  await expect(page.locator('[data-tags-input-item-preview]').first()).toHaveCSS(
    'background-color',
    /rgb\(/,
  );
  await openStory(page, 'sizes');
  await expect(page.locator('[data-tags-input-root]')).toHaveCount(4);
  await openStory(page, 'variants');
  await expect(page.locator('[data-tags-input-root]')).toHaveCount(3);
  await openStory(page, 'long-tags');
  await expect(tagText(page)).toHaveCount(5);
  await openStory(page, 'field');
  await expect(page.getByText('Separate tags with a comma')).toBeVisible();
  await openStory(page, 'explorer');
  await expect(tagText(page)).toHaveText(['SolidJS', storyBrand]);
}

/** Verify shared Combobox selection and external store clearing. */
async function verifiesCompositions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'combobox');
  await page.getByPlaceholder('Add tag...').fill('Type');
  await page.getByRole('option', { name: 'TypeScript' }).click();
  await expect(tagText(page)).toHaveText(['TypeScript']);

  await openStory(page, 'store');
  await page.getByPlaceholder('Add tag...').fill('Solid');
  await page.getByPlaceholder('Add tag...').press('Enter');
  await expect(page.getByText('Tags: ["Solid"]')).toBeVisible();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page.getByText('Tags: []')).toBeVisible();
}

/** Check native form data and splitting of a pasted value. */
async function verifiesFormAndPaste({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'form');
  const submitted: string[] = [];
  page.on(
    'console',
    /** Capture the example's submission log. */
    (message) => {
      if (message.text().startsWith('Submitted formData:')) submitted.push(message.text());
    },
  );
  await page.getByRole('textbox', { name: 'Title' }).fill('Library');
  await page.getByPlaceholder('Add tag...').fill('Solid');
  await page.getByPlaceholder('Add tag...').press('Enter');
  await expect(page.locator('input[name="categories"]')).toHaveValue('Solid');
  await page.getByRole('button', { name: 'Submit' }).click();
  expect(submitted).toHaveLength(1);

  await openStory(page, 'paste');
  const input = page.getByPlaceholder('Paste');
  await input.fill('React,Solid,TypeScript');
  await input.evaluate(
    /** Dispatch the browser input event produced by a multi-value paste. */
    (element) =>
      element.dispatchEvent(
        new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }),
      ),
  );
  await expect(tagText(page)).toHaveText(['React', 'Solid', 'TypeScript']);
}

test('all Tags Input examples render', verifiesInventory);
test('Tags Input entry, controlled state, and clear work', verifiesEntry);
test('Tags Input read-only and invalid states render', verifiesStates);
test('Tags Input entry rules work', verifiesEntryRules);
test('Tags Input display variants render', verifiesDisplay);
test('Tags Input Combobox and store work', verifiesCompositions);
test('Tags Input native form and paste work', verifiesFormAndPaste);
