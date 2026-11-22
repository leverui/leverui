import type {
  Api,
  EditChangeDetails,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
  Props,
  ValueChangeDetails,
} from '@zag-js/editable';
import type { PropTypes } from '@zag-js/solid';
import { type Accessor } from 'solid-js';

/** Keep public Editable declarations clear of the primitive's invalid bundled types. */
export type UseEditableProps = Omit<Props, 'id' | 'dir' | 'getRootNode'> & { id?: string };
export type UseEditableReturn = Accessor<Api<PropTypes>>;
export type UseEditableContext = UseEditableReturn;

export type EditableEditChangeDetails = EditChangeDetails;
export type EditableFocusOutsideEvent = FocusOutsideEvent;
export type EditableInteractOutsideEvent = InteractOutsideEvent;
export type EditablePointerDownOutsideEvent = PointerDownOutsideEvent;
export type EditableValueChangeDetails = ValueChangeDetails;
