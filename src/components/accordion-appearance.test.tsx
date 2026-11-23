import { cleanup, render, screen } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { Accordion } from '../index';

afterEach(cleanup);

/** Keep the primitive semantics and consumer hooks when default presentation is suppressed. */
function verifiesUnstyledAccordion(): void {
  render(
    /** Mount the public compound component without a styling provider. */
    () => (
      <Accordion.Root unstyled class="consumer-accordion" defaultValue={['first']}>
        <Accordion.Item value="first">
          <Accordion.ItemTrigger class="consumer-trigger" style={{ color: 'red' }}>
            First disclosure
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>First panel</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    ),
  );

  const trigger = screen.getByRole('button', { name: 'First disclosure' });
  const root = trigger.closest('.lui-accordion__root');
  expect(root?.getAttribute('data-unstyled')).toBe('');
  expect(root?.classList.contains('consumer-accordion')).toBe(true);
  expect(trigger.getAttribute('data-unstyled')).toBe('');
  expect(trigger.classList.contains('consumer-trigger')).toBe(true);
  expect(trigger.style.color).toBe('red');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByText('First panel')).toBeTruthy();
}

it('preserves semantics and native hooks without a styling provider', verifiesUnstyledAccordion);
