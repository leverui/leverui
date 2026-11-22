import type {
  Api as SplitterApi,
  ExpandCollapseDetails,
  PanelData,
  PanelProps,
  ResizeDetails,
  ResizeEndDetails,
  ResizeTriggerProps,
  Props as SplitterProps,
  SplitterRegistry,
  SplitterRegistryOptions,
} from '@zag-js/splitter';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type SplitterExpandCollapseDetails = ExpandCollapseDetails;
export type SplitterPanelData = PanelData;
export type SplitterResizeDetails = ResizeDetails;
export type SplitterResizeEndDetails = ResizeEndDetails;
export type SplitterPanelMachineProps = PanelProps;
export type SplitterResizeTriggerMachineProps = ResizeTriggerProps;
export type SplitterRegistryProps = SplitterRegistryOptions;
export type SplitterRegistryReturn = SplitterRegistry;

export type UseSplitterProps = Omit<SplitterProps, 'dir' | 'getRootNode' | 'id'> & {
  id?: string;
};
export type UseSplitterReturn = Accessor<SplitterApi<PropTypes>>;
export type UseSplitterContext = UseSplitterReturn;

export interface SplitterContextProps {
  children: (context: UseSplitterContext) => JSX.Element;
}
