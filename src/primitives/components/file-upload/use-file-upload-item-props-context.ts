import type { ItemProps } from '@zag-js/file-upload';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseFileUploadItemPropsContext = Accessor<ItemProps>;

export const [FileUploadItemPropsProvider, useFileUploadItemPropsContext] =
  createContext<UseFileUploadItemPropsContext>({
    hookName: 'useFileUploadItemPropsContext',
    providerName: '<FileUploadItemPropsProvider />',
  });
