import { Button, Card, Field, RatingGroup, Textarea } from '@leverui/components';
import { CircleCheckIcon } from '@lucide/solid';
import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';

const ratingWords = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
const highlights = ['Fast delivery', 'Packaging', 'Quality', 'Price'];
const maxLength = 200;

/** Rate an order, pick what stood out, add a comment, and send it. */
export function FeedbackCard(): JSX.Element {
  const [rating, setRating] = createSignal(0);
  const [picked, setPicked] = createSignal<readonly string[]>([]);
  const [comment, setComment] = createSignal('');
  const [sent, setSent] = createSignal(false);

  /** Add a highlight, or remove it when it is already picked. */
  function toggle(highlight: string): void {
    setPicked((current) =>
      current.includes(highlight)
        ? current.filter(
            /** Keep the other highlights. */
            (item) => item !== highlight,
          )
        : [...current, highlight],
    );
  }

  /** Reopen the review, keeping what was entered. */
  function edit(): void {
    setSent(false);
  }

  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Rate your order</Card.Title>
        <Card.Description>Order #3104, delivered Tuesday.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Show
          when={!sent()}
          fallback={
            <div class="home-showcase-thanks">
              <CircleCheckIcon class="home-showcase-thanks-icon" />
              <strong>Thanks for your review</strong>
              <span class="home-showcase-hint">
                You rated this order {rating()} out of 5. It helps other shoppers.
              </span>
              <Button type="button" variant="outline" size="sm" onClick={edit}>
                Edit review
              </Button>
            </div>
          }
        >
          <div class="home-showcase-feedback">
            <div class="home-example-row">
              <RatingGroup.Root
                count={5}
                value={rating()}
                onValueChange={
                  /** Keep the chosen number of stars. */
                  (details) => setRating(details.value)
                }
                colorPalette="orange"
                size="lg"
                aria-label="Rating"
              >
                <RatingGroup.HiddenInput />
                <RatingGroup.Control />
              </RatingGroup.Root>
              <span class="home-showcase-rating-word">{ratingWords[rating()] ?? ''}</span>
            </div>
            <div class="home-showcase-chips" role="group" aria-label="What stood out">
              <For each={highlights}>
                {/** One highlight to pick or unpick. */}
                {(highlight) => (
                  <Button
                    type="button"
                    size="xs"
                    variant={picked().includes(highlight) ? 'subtle' : 'outline'}
                    colorPalette={picked().includes(highlight) ? 'cyan' : 'gray'}
                    aria-pressed={picked().includes(highlight) ? 'true' : 'false'}
                    onClick={
                      /** Pick or unpick this highlight. */
                      () => toggle(highlight)
                    }
                  >
                    {highlight}
                  </Button>
                )}
              </For>
            </div>
            <Field.Root>
              <Field.Label>Comments</Field.Label>
              <Textarea
                class="home-showcase-comment"
                rows={3}
                maxlength={maxLength}
                value={comment()}
                onInput={
                  /** Keep what has been typed. */
                  (event) => setComment(event.currentTarget.value)
                }
                placeholder="What did you like, or what could be better?"
              />
              <Field.HelperText class="home-showcase-count">
                {comment().length}/{maxLength}
              </Field.HelperText>
            </Field.Root>
            <Button
              type="button"
              colorPalette="cyan"
              size="sm"
              disabled={rating() === 0}
              onClick={
                /** Send the review. */
                () => setSent(true)
              }
            >
              {rating() === 0 ? 'Choose a rating' : 'Submit review'}
            </Button>
          </div>
        </Show>
      </Card.Body>
    </Card.Root>
  );
}
