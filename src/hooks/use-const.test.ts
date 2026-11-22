import { createRoot } from 'solid-js';
import { expect, test, vi } from 'vitest';
import { useConst } from './use-const';

/** Verify a lazy initializer runs once for each component setup call. */
function verifiesInitializer(): void {
  const initializer = vi.fn(
    /** Construct the stable value for this owner. */
    () => ({ value: 42 }),
  );
  createRoot(
    /** Create the stable value inside one Solid owner. */
    (dispose) => {
      const stable = useConst(initializer);
      expect(stable).toEqual({ value: 42 });
      expect(stable.value).toBe(42);
      expect(initializer).toHaveBeenCalledTimes(1);
      dispose();
    },
  );
  expect(useConst('literal')).toBe('literal');
}

test('useConst initializes a stable setup value once', verifiesInitializer);
