import { Accordion, Card } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const questions = [
  {
    value: 'plan',
    question: 'Can I change my plan later?',
    answer: 'Yes. Switch plans at any time, and we adjust your next bill.',
  },
  {
    value: 'export',
    question: 'How do I export my data?',
    answer: 'Open Settings, then Data, and download everything as a CSV file.',
  },
  {
    value: 'cancel',
    question: 'What happens if I cancel?',
    answer: 'Your account stays open until the end of the billing period.',
  },
] as const;

/** Common questions, each opening to its answer. */
export function FaqCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Questions</Card.Title>
      </Card.Header>
      <Card.Body>
        <Accordion.Root collapsible defaultValue={['plan']}>
          <For each={questions}>
            {/** One question and its answer. */}
            {(item) => (
              <Accordion.Item value={item.value}>
                <Accordion.ItemTrigger>
                  <span class="home-showcase-grow">{item.question}</span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>{item.answer}</Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            )}
          </For>
        </Accordion.Root>
      </Card.Body>
    </Card.Root>
  );
}
