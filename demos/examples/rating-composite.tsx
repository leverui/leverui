import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Avatar, Button, Field, HStack, RatingGroup, Stack, Text } from '../../src';

/** Embed a read-only orange rating in a testimonial. */
export function RatingTestimonial(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '320px' }}>
      <RatingGroup.Root colorPalette="orange" readOnly count={5} defaultValue={5} size="xs">
        <RatingGroup.HiddenInput />
        <RatingGroup.Control />
      </RatingGroup.Root>
      <Text>Rafe rebuilt our checkout in two weeks. He is careful and easy to work with.</Text>
      <HStack gap="4">
        <Avatar.Root>
          <Avatar.Fallback name="Oskar Brandt" />
          <Avatar.Image src="/demo-images/avatars/avatar-2.webp" />
        </Avatar.Root>
        <Stack gap="0" textStyle="sm">
          <Text style={{ 'font-weight': 'var(--leverui-font-weights-medium)' }}>Oskar Brandt</Text>
          <Text style={{ color: 'var(--leverui-colors-fg-muted)' }}>CTO, Fernhill Labs</Text>
        </Stack>
      </HStack>
    </Stack>
  );
}

/** Require a rating before the form submits. */
export function RatingHookForm(): JSX.Element {
  const [rating, setRating] = createSignal<number>();
  const [error, setError] = createSignal('');

  /** Keep the selected rating in Solid form state. */
  function updateRating(details: { value: number }): void {
    setRating(details.value);
    setError('');
  }

  /** Validate one through five before logging the selected rating. */
  function submit(event: SubmitEvent): void {
    event.preventDefault();
    const value = rating();
    if (value === undefined || value < 1 || value > 5) {
      setError('Rating is required');
      return;
    }
    console.log({ rating: value });
  }

  return (
    <form onSubmit={submit}>
      <Stack gap="4" align="flex-start">
        <Field.Root invalid={Boolean(error())}>
          <Field.Label>Rating</Field.Label>
          <RatingGroup.Root count={5} name="rating" value={rating()} onValueChange={updateRating}>
            <RatingGroup.HiddenInput />
            <RatingGroup.Control />
          </RatingGroup.Root>
          <Field.ErrorText>{error()}</Field.ErrorText>
        </Field.Root>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
}
