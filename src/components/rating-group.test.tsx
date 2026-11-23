import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it, vi } from 'vitest';
import { RatingGroup, type RatingGroupValueChangeDetails } from '../index';

afterEach(cleanup);

/** Render the default items with the primitive's hidden form input. */
function DefaultRating(props: {
  defaultValue?: number;
  allowHalf?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onValueChange?: (details: RatingGroupValueChangeDetails) => void;
}) {
  return (
    <>
      <form data-testid="rating-form">
        <RatingGroup.Root name="score" {...props}>
          <RatingGroup.Label>Quality</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
      </form>
    </>
  );
}

/** Verify default items, native form data, and machine change details. */
async function verifiesDefaultSelection(): Promise<void> {
  const handleValueChange = vi.fn<(details: RatingGroupValueChangeDetails) => void>();
  render(
    /** Mount one uncontrolled rating group. */
    () => <DefaultRating defaultValue={2} onValueChange={handleValueChange} />,
  );
  const radios = screen.getAllByRole('radio');
  expect(radios).toHaveLength(5);
  expect(screen.getByRole('radiogroup', { name: 'Quality' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute('aria-checked', 'true');
  const form = screen.getByTestId('rating-form') as HTMLFormElement;
  expect(new FormData(form).get('score')).toBe('2');
  fireEvent.click(screen.getByRole('radio', { name: '4 stars' }));
  await waitFor(
    /** Follow the selected native form value after the primitive updates it. */
    () => expect(new FormData(form).get('score')).toBe('4'),
  );
  expect(handleValueChange).toHaveBeenCalledWith({ value: 4 });
  expect(screen.getByRole('radio', { name: '4 stars' })).toHaveAttribute('aria-checked', 'true');
}

it('renders default items and submits the selected rating', verifiesDefaultSelection);

/** Preserve the layered star and half selection markers. */
function verifiesHalfRating(): void {
  render(
    /** Mount a half rating through the public root. */
    () => <DefaultRating defaultValue={2.5} allowHalf />,
  );
  // Zag 2.0.0-next.4 names the half-selected item by its value, "2.5 stars".
  const third = screen.getByRole('radio', { name: '2.5 stars' });
  const indicator = third.querySelector('.lui-rating-group__itemIndicator');
  expect(third).toHaveAttribute('aria-checked', 'true');
  expect(indicator).toHaveAttribute('data-half', '');
  expect(indicator?.querySelectorAll('svg')).toHaveLength(2);
  expect(indicator?.querySelector('[data-bg]')).not.toBeNull();
  expect(indicator?.querySelector('[data-fg]')).not.toBeNull();
}

it('renders two icon layers for a half rating', verifiesHalfRating);

/** Keep a disabled rating out of pointer selection and form submission. */
function verifiesDisabledRating(): void {
  render(
    /** Mount a disabled rating with an existing value. */
    () => <DefaultRating defaultValue={2} disabled />,
  );
  fireEvent.click(screen.getByRole('radio', { name: '4 stars' }));
  expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute('aria-checked', 'true');
  expect(
    new FormData(screen.getByTestId('rating-form') as HTMLFormElement).get('score'),
  ).toBeNull();
}

it('prevents disabled selection and form submission', verifiesDisabledRating);

/** Keep readonly selection fixed while preserving required native state. */
function verifiesReadonlyRequiredRating(): void {
  render(
    /** Mount a readonly required rating. */
    () => <DefaultRating defaultValue={2} readOnly required />,
  );
  fireEvent.click(screen.getByRole('radio', { name: '4 stars' }));
  expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute('aria-checked', 'true');
  const input = document.querySelector('input[name="score"]');
  expect(input).toHaveAttribute('readonly');
  expect(input).toBeRequired();
}

it('preserves readonly and required semantics', verifiesReadonlyRequiredRating);
