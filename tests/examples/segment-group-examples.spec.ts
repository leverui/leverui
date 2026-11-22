import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'color-palette',
  'custom-indicator',
  'card',
  'vertical',
  'disabled',
  'disabled-item',
  'hook-form',
  'icon',
  'sizes',
] as const;

/** Require every example to render its segment group. */
async function verifiesEverySegmentStory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-segment-group--${id}`);
    await expect(page.getByRole('radiogroup').first()).toBeVisible();
  }
}

/** Check labels and controlled selection. */
async function verifiesBasicAndControlled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--basic');
  await expect(page.getByRole('radio', { name: 'React' })).toBeChecked();
  await page.getByText('Solid', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Solid' })).toBeChecked();

  await page.goto('/iframe.html?id=components-segment-group--controlled');
  await page.getByText('Vue', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Vue' })).toBeChecked();
}

/** Verify vertical layout and both disabled contracts. */
async function verifiesStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--vertical');
  await expect(page.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'vertical');

  await page.goto('/iframe.html?id=components-segment-group--disabled');
  await expect(page.getByRole('radio', { name: 'Solid' })).toBeDisabled();

  await page.goto('/iframe.html?id=components-segment-group--disabled-item');
  await expect(page.getByRole('radio', { name: 'Vue' })).toBeDisabled();
  await page.getByText('Solid', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Solid' })).toBeChecked();
}

/** Verify each composite example's visible structure. */
async function verifiesComposites({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--card');
  await expect(page.getByRole('radiogroup')).toHaveCount(3);
  await expect(page.getByText('Search homes for rent')).toBeVisible();

  await page.goto('/iframe.html?id=components-segment-group--icon');
  await expect(page.getByRole('radio')).toHaveCount(3);
  await expect(page.locator('[data-radio-group-item] .lucide')).toHaveCount(3);

  await page.goto('/iframe.html?id=components-segment-group--sizes');
  await expect(page.getByRole('radiogroup')).toHaveCount(4);
  await expect(page.getByText('size = lg')).toBeVisible();
}

/** Check palette styling and the custom indicator color token. */
async function verifiesVisualVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--color-palette');
  await expect(page.getByRole('radio', { name: 'Monthly' })).toBeChecked();
  await page.getByText('Yearly', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Yearly' })).toBeChecked();

  await page.goto('/iframe.html?id=components-segment-group--custom-indicator');
  await expect(page.locator('[data-radio-group-indicator]')).toHaveCSS(
    'background-color',
    'rgb(20, 184, 166)',
  );
}

/** Submit the Solid form with its selected native radio value. */
async function verifiesForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group--hook-form');
  await expect(page.getByRole('radio', { name: 'md' })).toBeChecked();
  await page.getByText('lg', { exact: true }).click();
  const values = await page.locator('form').evaluate(
    /** Read the form data produced by the actual native inputs. */
    (form) => new FormData(form as HTMLFormElement).get('fontSize'),
  );
  expect(values).toBe('lg');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Font size is required')).not.toBeVisible();
}

test('all Segment Group stories render', verifiesEverySegmentStory);
test('Segment Group basic and controlled values work', verifiesBasicAndControlled);
test('Segment Group orientation and disabled states work', verifiesStates);
test('Segment Group composite stories match their structures', verifiesComposites);
test('Segment Group palette and indicator variants work', verifiesVisualVariants);
test('Segment Group form submits its selection', verifiesForm);
