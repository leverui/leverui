import { createComponent, createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Box } from '../src';

/** Show's element-children form, which renders its branch in Show's own scope. */
type ShowBranchProps = { when: boolean; children: JSX.Element };

type ScopeParts = {
  Box: typeof Box;
};

/** Render one removable branch with its own CSS variable scope. */
function renderBranch(parts: ScopeParts, name: 'alpha' | 'beta'): JSX.Element {
  return createComponent(parts.Box, {
    class: `disposal-scope-${name}`,
    /** Keep the sample inside its closest variable scope. */
    get children() {
      return createComponent(parts.Box, {
        id: `${name}-disposal-box`,
        class: 'disposal-scope-sample',
        children: name,
      });
    },
  });
}

/** Render two CSS scopes that can leave the tree independently. */
export function renderCssScopeDisposalExample(parts: ScopeParts): JSX.Element {
  const [alphaVisible, setAlphaVisible] = createSignal(true);
  const [betaVisible, setBetaVisible] = createSignal(true);

  /** Remove only the alpha scope from its Solid owner. */
  function removeAlpha(): void {
    setAlphaVisible(false);
  }

  /** Remove only the beta scope from its Solid owner. */
  function removeBeta(): void {
    setBetaVisible(false);
  }

  return [
    createComponent<ShowBranchProps>(Show, {
      /** Track alpha's mounted lifetime. */
      get when() {
        return alphaVisible();
      },
      /** Build alpha only while it is visible. */
      get children() {
        return renderBranch(parts, 'alpha');
      },
    }),
    createComponent<ShowBranchProps>(Show, {
      /** Track beta's mounted lifetime. */
      get when() {
        return betaVisible();
      },
      /** Build beta only while it is visible. */
      get children() {
        return renderBranch(parts, 'beta');
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'remove-alpha',
      onClick: removeAlpha,
      children: 'Remove alpha',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'remove-beta',
      onClick: removeBeta,
      children: 'Remove beta',
    }),
  ];
}
