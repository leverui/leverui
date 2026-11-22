import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Heading, Highlight, MarkPropsProvider, useHighlight, type HighlightChunk } from '../src';
import './highlight-contract.css';

/** Exercise the documented match, styling, and reactive query cases. */
function HighlightContractExample(): JSX.Element {
  const [changed, setChanged] = createSignal(false);

  /** Switch the live query, source text, and mark class together. */
  function toggleQuery(): void {
    setChanged(!changed());
  }

  return (
    <>
      <p data-testid="highlight-basic">
        <Highlight query="spotlight" markClass="highlight-orange">
          With Highlight, you can spotlight words.
        </Highlight>
      </p>
      <p data-testid="highlight-multiple">
        <Highlight query={['Solid', 'fast']}>Solid is great and Solid is fast</Highlight>
      </p>
      <p data-testid="highlight-first">
        <Highlight query="Solid">Solid is great and Solid is fast</Highlight>
      </p>
      <p data-testid="highlight-case">
        <Highlight query="solid" ignoreCase>
          Solid is great
        </Highlight>
      </p>
      <p data-testid="highlight-live">
        <Highlight
          query={changed() ? 'fast' : 'great'}
          markClass={changed() ? 'highlight-heavy' : undefined}
        >
          {changed() ? 'Solid is fast now' : 'Solid is great now'}
        </Highlight>
      </p>
      <p data-testid="highlight-unmatched">
        <Highlight query="missing">Nothing matches here</Highlight>
      </p>
      <MarkPropsProvider
        value={{
          variant: changed() ? 'text' : 'solid',
          colorPalette: 'blue',
          class: 'provider-mark',
          title: 'Provided match',
        }}
      >
        <p data-testid="highlight-provider">
          <Highlight query={['Solid', 'fast']} markClass="highlight-red">
            Solid is fast
          </Highlight>
        </p>
      </MarkPropsProvider>
      <MarkPropsProvider value={{ unstyled: true }}>
        <p data-testid="highlight-unstyled-provider">
          <Highlight query="Plain">Plain mark</Highlight>
        </p>
      </MarkPropsProvider>
      <button type="button" data-testid="highlight-toggle" onClick={toggleQuery}>
        Toggle search
      </button>
    </>
  );
}

/** Expose the primitive's exact-word matching through Lever UI's reactive public hook. */
function HighlightHookExample(): JSX.Element {
  const [query, setQuery] = createSignal('team');
  const chunks = useHighlight(
    /** Recompute whole-word matches from the current query. */
    () => ({
      text: 'Team teammate team',
      query: query(),
      ignoreCase: true,
      exactMatch: true,
      matchAll: true,
    }),
  );

  /** Select a query that has no whole-word match. */
  function changeQuery(): void {
    setQuery('mate');
  }

  return (
    <>
      <output data-testid="highlight-hook-chunks">
        {chunks()
          .map(
            /** Bracket only the chunks reported as matches. */
            (chunk) => (chunk.match ? `[${chunk.text}]` : chunk.text),
          )
          .join('')}
      </output>
      <button type="button" data-testid="highlight-hook-toggle" onClick={changeQuery}>
        Change query
      </button>
    </>
  );
}

/** Compose custom wavy marks from the public matching hook. */
function HighlightSquiggleExample(): JSX.Element {
  const chunks = useHighlight({
    text: 'Accessible by default, delightful by design.',
    query: ['Accessible', 'delightful by design.'],
  });

  /** Give matched words a decorative underline while preserving their text. */
  function renderChunk(chunk: HighlightChunk): JSX.Element {
    return chunk.match ? (
      <mark
        data-testid="highlight-squiggle-mark"
        style={{ 'background-color': 'transparent', 'text-decoration': 'underline wavy red' }}
      >
        {chunk.text}
      </mark>
    ) : (
      chunk.text
    );
  }

  return (
    <>
      <Heading size="2xl" data-testid="highlight-squiggle">
        <For each={chunks()}>{renderChunk}</For>
      </Heading>
    </>
  );
}

const meta = {
  title: 'Content/Highlight',
  component: HighlightContractExample,
} satisfies Meta<typeof HighlightContractExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contract: Story = {};

export const Hook: Story = { render: HighlightHookExample };

export const Squiggle: Story = { render: HighlightSquiggleExample };
