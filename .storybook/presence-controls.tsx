import { For, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export interface PresenceControlsProps {
  present: Accessor<boolean>;
  lazyPresent: Accessor<boolean>;
  exitPresent: Accessor<boolean>;
  childPresent: Accessor<boolean>;
  togglePresent: () => void;
  toggleLazy: () => void;
  toggleExit: () => void;
  toggleChild: () => void;
}

interface PresenceControl {
  id: string;
  label: string;
  expanded: Accessor<boolean>;
  toggle: () => void;
}

/** Render the four presence toggles with their live expanded states. */
export function PresenceControls(props: PresenceControlsProps): JSX.Element {
  const controls: readonly PresenceControl[] = [
    {
      id: 'presence-toggle',
      label: 'Toggle animations',
      expanded: props.present,
      toggle: props.togglePresent,
    },
    {
      id: 'presence-lazy-toggle',
      label: 'Toggle lazy',
      expanded: props.lazyPresent,
      toggle: props.toggleLazy,
    },
    {
      id: 'presence-exit-toggle',
      label: 'Toggle exit',
      expanded: props.exitPresent,
      toggle: props.toggleExit,
    },
    {
      id: 'presence-child-toggle',
      label: 'Toggle child',
      expanded: props.childPresent,
      toggle: props.toggleChild,
    },
  ];

  /** Keep each native button named and synchronized with its panel. */
  function renderControl(control: PresenceControl): JSX.Element {
    return (
      <button
        type="button"
        data-testid={control.id}
        aria-expanded={control.expanded() ? 'true' : 'false'}
        onClick={control.toggle}
      >
        {control.label}
      </button>
    );
  }

  return <For each={controls}>{renderControl}</For>;
}
