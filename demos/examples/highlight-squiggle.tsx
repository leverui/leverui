import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Heading, Mark, useHighlight } from '../../src';
import './highlight-squiggle.css';

const phrase = 'Accessible by default, delightful by design.';
/** An original hand-drawn wave, inlined so the example loads no remote asset. */
const underlineUrl =
  "data:image/svg+xml,%3Csvg width='580' height='23' viewBox='0 0 580 23' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 14C39 4 71 4 107 12S179 20 215 11 287 3 323 11 395 20 431 11 503 3 539 11 571 17 577 13' stroke='%23686764' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

/** Add the underline to each emphasized phrase. */
function UnderlinedMatch(props: { text: string }): JSX.Element {
  return (
    <Mark class="example-highlight-squiggle">
      {props.text}
      <img src={underlineUrl} class="example-highlight-squiggle-line" loading="lazy" alt="" />
    </Mark>
  );
}

/** Split the heading into styled and ordinary text chunks. */
export function HighlightWithSquiggle(): JSX.Element {
  const chunks = useHighlight({ text: phrase, query: ['delightful by design.'] });
  return (
    <Heading size="2xl" style={{ 'max-width': '20ch' }}>
      <For each={chunks()}>
        {
          /** Decorate only the matched phrase chunks. */
          (chunk) => (chunk.match ? <UnderlinedMatch text={chunk.text} /> : chunk.text)
        }
      </For>
    </Heading>
  );
}
