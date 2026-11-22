import * as fileUpload from '@zag-js/file-upload';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import { useFieldContext } from '../field/index';

export type UseFileUploadProps = Optional<Omit<fileUpload.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseFileUploadReturn = Accessor<fileUpload.Api<PropTypes>>;

/** Create the file upload state and return its API. */
export const useFileUpload = (props?: MaybeAccessor<UseFileUploadProps>): UseFileUploadReturn => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();
  const field = useFieldContext();

  const machineProps = createMemo<fileUpload.Props>(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    locale: locale().locale,
    readOnly: field?.().readOnly,
    required: field?.().required,
    invalid: field?.().invalid,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(fileUpload.machine, machineProps);
  return createMemo(() => fileUpload.connect(service, normalizeProps));
};
