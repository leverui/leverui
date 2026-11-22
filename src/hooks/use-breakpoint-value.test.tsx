import { render, screen } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { afterEach, expect, test } from 'vitest';
import { useBreakpoint, useBreakpointValue, useMediaQuery, type BreakpointName } from '../index';
import {
  installMatchMedia,
  restoreViewport,
  setMediaRootFontSize,
  setViewportWidth,
} from '../../tests/support/media-query-fixture';

afterEach(restoreViewport);

/** Verify object and array values follow the static CSS breakpoint thresholds. */
function verifiesStaticBreakpoints(): void {
  installMatchMedia();
  setMediaRootFontSize(20);
  flush();
  setViewportWidth(850);
  flush();

  /** Show two responsive values without a styling provider. */
  function Example() {
    const objectValue = useBreakpointValue({ base: 'compact', lg: 'wide' }, { ssr: false });
    const arrayValue = useBreakpointValue(['base', null, null, 'large'], { ssr: false });
    return <span>{`${objectValue()} / ${arrayValue()}`}</span>;
  }

  render(Example);

  expect(screen.getByText('compact / base')).toBeTruthy();
  setViewportWidth(950);
  flush();
  expect(screen.getByText('compact / base')).toBeTruthy();
  setViewportWidth(1150);
  flush();
  expect(screen.getByText('wide / large')).toBeTruthy();
  setViewportWidth(880);
  flush();
  expect(screen.getByText('compact / base')).toBeTruthy();
}

test('useBreakpointValue follows static CSS breakpoints', verifiesStaticBreakpoints);

/** Verify multiple CSS queries update when their media lists change. */
function verifiesMediaQueries(): void {
  installMatchMedia();
  setViewportWidth(800);
  flush();

  /** Render current matches as visible browser state. */
  function Example() {
    const matches = useMediaQuery(['(min-width: 600px)', '(min-width: 900px)'], { ssr: false });
    return <span>{matches().join(',')}</span>;
  }

  render(Example);
  expect(screen.getByText('true,false')).toBeTruthy();
  setViewportWidth(950);
  flush();
  expect(screen.getByText('true,true')).toBeTruthy();
}

test('useMediaQuery follows multiple browser queries', verifiesMediaQueries);

/** Replace one live query and retain browser change observation. */
function verifiesReactiveQueries(): void {
  installMatchMedia();
  setViewportWidth(800);
  flush();
  const [threshold, setThreshold] = createSignal('600px');

  /** Show the match for the current Solid query string. */
  function Example() {
    const matches = useMediaQuery(
      /** Rebuild the media query when its threshold changes. */
      () => [`(min-width: ${threshold()})`],
      { ssr: false },
    );
    return <span>{String(matches()[0])}</span>;
  }

  render(Example);
  expect(screen.getByText('true')).toBeTruthy();
  setThreshold('900px');
  flush();
  expect(screen.getByText('false')).toBeTruthy();
  setViewportWidth(950);
  flush();
  expect(screen.getByText('true')).toBeTruthy();
}

test('useMediaQuery follows reactive query changes', verifiesReactiveQueries);

/** Verify filtered and fallback breakpoints without a styling provider. */
function verifiesBreakpointSelection(): void {
  installMatchMedia();
  setMediaRootFontSize(20);
  flush();
  setViewportWidth(1150);
  flush();
  /** Show the highest allowed breakpoint and the unfiltered fallback path. */
  function Example() {
    const filtered = useBreakpoint({ ssr: false, breakpoints: ['base', 'sm', 'md'] });
    const fallback = useBreakpoint({ ssr: false, fallback: 'sm' });
    return <span>{`${filtered()} / ${fallback()}`}</span>;
  }

  render(Example);
  expect(screen.getByText('md / lg')).toBeTruthy();
  setViewportWidth(700);
  flush();
  expect(screen.getByText('sm / sm')).toBeTruthy();
  setViewportWidth(-1);
  flush();
  expect(screen.getByText('base / sm')).toBeTruthy();
}

test('useBreakpoint selects the highest allowed match and fallback', verifiesBreakpointSelection);

/** Check every authored breakpoint boundary and a reactive name filter. */
function verifiesBreakpointBoundaries(): void {
  installMatchMedia();
  setViewportWidth(479);
  flush();
  const [allowed, setAllowed] = createSignal<readonly BreakpointName[]>([
    'base',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ]);

  /** Render the selected name as the viewport and filter change. */
  function Example() {
    const current = useBreakpoint({ ssr: false, breakpoints: allowed });
    return <span>{current()}</span>;
  }

  render(Example);
  expect(screen.getByText('base')).toBeTruthy();
  for (const [width, name] of [
    [480, 'sm'],
    [768, 'md'],
    [1024, 'lg'],
    [1280, 'xl'],
    [1536, '2xl'],
  ] as const) {
    setViewportWidth(width);
    flush();
    expect(screen.getByText(name)).toBeTruthy();
  }
  setAllowed(['base', 'sm', 'md', 'lg', 'xl']);
  flush();
  expect(screen.getByText('xl')).toBeTruthy();
}

test('useBreakpoint tracks static boundaries and reactive filters', verifiesBreakpointBoundaries);

/** Verify media queries use the caller's iframe window instead of the ambient one. */
function verifiesCustomWindow(): void {
  const frame = document.createElement('iframe');
  document.body.append(frame);
  const availableWindow = frame.contentWindow;
  if (!availableWindow) throw new Error('The test iframe did not create a window.');
  const frameWindow: Window = availableWindow;
  installMatchMedia(frameWindow);
  setViewportWidth(600);
  flush();
  setViewportWidth(1200, frameWindow);
  flush();

  /** Show all three responsive results from the selected iframe window. */
  function Example() {
    /** Select the iframe window for every responsive hook. */
    function getFrameWindow(): Window {
      return frameWindow;
    }
    const matches = useMediaQuery(['(min-width: 1000px)'], {
      ssr: false,
      getWindow: getFrameWindow,
    });
    const breakpoint = useBreakpoint({ ssr: false, getWindow: getFrameWindow });
    const value = useBreakpointValue(
      { base: 'compact', lg: 'wide' },
      {
        ssr: false,
        getWindow: getFrameWindow,
      },
    );
    return <span>{`${matches()[0]} / ${breakpoint()} / ${value()}`}</span>;
  }

  render(Example);
  expect(screen.getByText('true / lg / wide')).toBeTruthy();
  frame.remove();
}

test('useMediaQuery honors a custom window', verifiesCustomWindow);
