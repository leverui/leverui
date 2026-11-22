import { createSignal } from 'solid-js';
import type { CardType } from './card-types';
import type {
  PaymentErroredInputs,
  PaymentField,
  PaymentMeta,
  PaymentTouchedInputs,
  UsePaymentInputsOptions,
} from './payment-types';

/** The reactive state behind `usePaymentInputs` and the updates its fields make. */
export interface PaymentMetaController {
  readonly meta: PaymentMeta;
  readonly setCardType: (cardType: CardType | undefined) => void;
  readonly setFocused: (field: PaymentField | undefined) => void;
  readonly setInputError: (field: PaymentField, error: string | undefined) => void;
  readonly setInputTouched: (field: PaymentField, touched: boolean) => void;
}

const noErrors: PaymentErroredInputs = {
  cardNumber: undefined,
  expiryDate: undefined,
  cvc: undefined,
  zip: undefined,
};
const untouched: PaymentTouchedInputs = {
  cardNumber: false,
  expiryDate: false,
  cvc: false,
  zip: false,
};

/** Hold the field errors, touched flags, focus, and card brand, notifying the option callbacks. */
export function createPaymentMeta(options: UsePaymentInputsOptions): PaymentMetaController {
  const [cardType, setCardType] = createSignal<CardType>();
  const [erroredInputs, setErroredInputs] = createSignal(noErrors);
  const [error, setError] = createSignal<string>();
  const [focused, setFocused] = createSignal<PaymentField>();
  const [isTouched, setIsTouched] = createSignal(false);
  const [touchedInputs, setTouchedInputs] = createSignal(untouched);
  // Solid 2 applies signal writes on flush, so several updates in one tick
  // build on these latest values rather than on a stale signal read.
  let latestErrors = noErrors;
  let latestTouched = untouched;

  /** Record one field's error; the shared error becomes it, or the first remaining one. */
  function setInputError(field: PaymentField, fieldError: string | undefined): void {
    const current = latestErrors;
    if (current[field] === fieldError) return;
    const next = { ...current, [field]: fieldError };
    latestErrors = next;
    const firstError = fieldError ?? Object.values(next).find(Boolean);
    setErroredInputs(next);
    setError(firstError);
    options.onError?.(firstError, next);
  }

  /**
   * Record one field's touched state. The form counts as touched once focus has left every
   * input, which is known only after the browser moves focus, so that check waits a frame.
   */
  function setInputTouched(field: PaymentField, touched: boolean): void {
    requestAnimationFrame(
      /** Check where focus went after the blur or edit. */
      () => {
        if (document.activeElement?.tagName !== 'INPUT') setIsTouched(true);
        else if (!touched) setIsTouched(false);
      },
    );
    const current = latestTouched;
    if (current[field] === touched) return;
    const next = { ...current, [field]: touched };
    latestTouched = next;
    setTouchedInputs(next);
    options.onTouch?.({ [field]: touched }, next);
  }

  const meta: PaymentMeta = {
    /** The detected card brand. */
    get cardType() {
      return cardType();
    },
    /** Each field's current error. */
    get erroredInputs() {
      return erroredInputs();
    },
    /** The first field error. */
    get error() {
      return error();
    },
    /** The field that has focus. */
    get focused() {
      return focused();
    },
    /** Whether focus has left every field. */
    get isTouched() {
      return isTouched();
    },
    /** Each field's touched flag. */
    get touchedInputs() {
      return touchedInputs();
    },
  };
  return {
    meta,
    /** Store a brand, wrapped so Solid does not call it as an updater. */
    setCardType: (value) => setCardType(() => value),
    /** Store the focused field. */
    setFocused: (field) => setFocused(() => field),
    setInputError,
    setInputTouched,
  };
}
