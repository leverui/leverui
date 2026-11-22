import assert from 'node:assert/strict';

/** Verify the installed Slider's CSS hook and native form behavior. */
export async function verifyPackedSlider(page) {
  const root = page.getByTestId('packed-slider-root');
  const thumb = page.getByRole('slider', { name: 'Volume' });
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /leverui-slider__root/);
  assert.equal(
    await thumb.evaluate(
      /** Read an ordinary consumer stylesheet's override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '31px',
  );
  assert.equal(await thumb.getAttribute('aria-valuenow'), '30');
  assert.equal(await page.getByText('Middle').count(), 1);
  await thumb.focus();
  await thumb.press('ArrowRight');
  assert.equal(await thumb.getAttribute('aria-valuenow'), '35');
  assert.equal(await page.getByTestId('packed-slider-value').textContent(), '35');
  assert.equal(
    await page.getByTestId('packed-slider-form').evaluate(
      /** Read the installed component's native submitted value. */
      (form) => new FormData(form).get('volume'),
    ),
    '35',
  );
}
