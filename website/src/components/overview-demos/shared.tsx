import { type JSX } from '@solidjs/web';
import '../../styles/overview-demos.css';

/** A plain icon for components with nothing to show, such as providers and helpers. */
export function HelperIcon(props: { name: string }): JSX.Element {
  return <i class={['bi', `bi-${props.name}`, 'overview-helper-icon']} aria-hidden="true" />;
}

/**
 * A static picture of an open popup, such as a menu or a tooltip. Overview demos draw the open
 * state with this panel and never mount the live popup.
 */
export function PopupSurface(props: { children: JSX.Element; width?: string }): JSX.Element {
  return (
    <div class="overview-popup-surface" style={{ width: props.width }}>
      {props.children}
    </div>
  );
}
