import type {
  Api as ProgressApi,
  Props as ProgressMachineProps,
  ValueChangeDetails,
  ValueTranslationDetails,
} from '@zag-js/progress';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';

export type UseProgressProps = Omit<ProgressMachineProps, 'dir' | 'getRootNode' | 'id'> & {
  id?: string;
};
export type UseProgressReturn = Accessor<ProgressApi<PropTypes>>;
export type UseProgressContext = UseProgressReturn;
export type ProgressValueChangeDetails = ValueChangeDetails;
export type ProgressValueTranslationDetails = ValueTranslationDetails;

export interface ProgressContextProps {
  children: (context: UseProgressContext) => JSX.Element;
}
