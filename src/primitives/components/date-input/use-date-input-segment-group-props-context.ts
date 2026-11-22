import { createContext } from '../../utils/create-context';
import type { SegmentGroupProps } from '@zag-js/date-input';

export type UseDateInputSegmentGroupPropsContext = SegmentGroupProps;

export const [DateInputSegmentGroupPropsProvider, useDateInputSegmentGroupPropsContext] =
  createContext<UseDateInputSegmentGroupPropsContext>({
    hookName: 'useDateInputSegmentGroupPropsContext',
    providerName: '<DateInput.SegmentGroup />',
    strict: true,
  });
