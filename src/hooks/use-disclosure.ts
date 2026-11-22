import { createSignal, type Accessor, type Setter } from 'solid-js';

/** Controlled and initial state with callbacks for a disclosure. */
export interface UseDisclosureProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

/** Solid accessors and actions for a disclosure's open state. */
export interface UseDisclosureReturn {
  open: Accessor<boolean>;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: Setter<boolean>;
}

/** Coordinate controlled or local disclosure state and open/close callbacks. */
export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const [localOpen, setOpen] = createSignal(props.defaultOpen ?? false);

  /** Prefer the current controlled prop when the caller supplies one. */
  function open(): boolean {
    return props.open ?? localOpen();
  }

  /** Open local state when uncontrolled, then notify the caller. */
  function onOpen(): void {
    if (props.open === undefined) setOpen(true);
    props.onOpen?.();
  }

  /** Close local state when uncontrolled, then notify the caller. */
  function onClose(): void {
    if (props.open === undefined) setOpen(false);
    props.onClose?.();
  }

  /** Choose the action from the current visible state. */
  function onToggle(): void {
    if (open()) onClose();
    else onOpen();
  }

  return { open, onOpen, onClose, onToggle, setOpen };
}
