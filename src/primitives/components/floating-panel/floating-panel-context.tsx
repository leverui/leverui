import { type JSX } from '@solidjs/web';
import {
  type UseFloatingPanelContext,
  useFloatingPanelContext,
} from './use-floating-panel-context';

export interface FloatingPanelContextProps {
  children: (context: UseFloatingPanelContext) => JSX.Element;
}

/** Render the FloatingPanel context context through a function child. */
export const FloatingPanelContext = (props: FloatingPanelContextProps) =>
  props.children(useFloatingPanelContext());
