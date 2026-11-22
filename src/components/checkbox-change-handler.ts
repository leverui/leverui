import type {
  CheckboxCheckedChangeDetails,
  CheckboxRootProps as PrimitiveRootProps,
} from '../primitives/components/checkbox';

/** Preserve Zag's controlled transition ordering for a Checkbox root. */
export function createCheckboxChangeHandler(
  readNative: () => Record<string, unknown>,
): (details: CheckboxCheckedChangeDetails) => void {
  /** Notify consumers after the current controlled transition has settled. */
  function handleCheckedChange(details: CheckboxCheckedChangeDetails): void {
    const native = readNative() as PrimitiveRootProps;
    const callback = native.onCheckedChange;
    if (!callback) return;
    const notifyConsumer = callback;

    /** Deliver one checked-state notification to the consumer. */
    function notify(): void {
      notifyConsumer(details);
    }

    if (native.checked === undefined) notify();
    else queueMicrotask(notify);
  }

  return handleCheckedChange;
}
