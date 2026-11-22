import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/dom';
import { flush } from 'solid-js';

// Solid 2 applies signal writes on its next flush. Flush after each dispatched
// event so assertions see the DOM the event produced.
configure({
  /** Apply Solid's queued writes after the event dispatch. */
  eventWrapper(dispatch) {
    const result = dispatch();
    flush();
    return result;
  },
  /** Apply Solid's queued writes after an async wait settles. */
  async asyncWrapper(run) {
    const result = await run();
    flush();
    return result;
  },
});
