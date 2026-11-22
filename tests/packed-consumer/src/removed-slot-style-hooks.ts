import type * as PublicApi from '@leverui/components';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type PublicModule = typeof PublicApi;
type RemovedHook =
  | 'useColorPickerStyles'
  | 'useComboboxStyles'
  | 'useDateInputStyles'
  | 'useDatePickerStyles'
  | 'useEditableStyles'
  | 'useFieldsetStyles'
  | 'useFileUploadStyles'
  | 'useListboxStyles'
  | 'useMenuStyles'
  | 'usePinInputStyles'
  | 'useSelectStyles'
  | 'useTabsStyles'
  | 'useSwitchStyles'
  | 'useTagsInputStyles';

export type RootStyleHooksRemoved = ExpectTrue<
  Extract<RemovedHook, keyof PublicModule> extends never ? true : false
>;
export type ColorPickerStyleHookRemoved = ExpectFalse<
  'useColorPickerStyles' extends keyof typeof PublicApi.ColorPicker ? true : false
>;
export type ComboboxStyleHookRemoved = ExpectFalse<
  'useComboboxStyles' extends keyof typeof PublicApi.Combobox ? true : false
>;
export type DateInputStyleHookRemoved = ExpectFalse<
  'useDateInputStyles' extends keyof typeof PublicApi.DateInput ? true : false
>;
export type DatePickerStyleHookRemoved = ExpectFalse<
  'useDatePickerStyles' extends keyof typeof PublicApi.DatePicker ? true : false
>;
export type EditableStyleHookRemoved = ExpectFalse<
  'useEditableStyles' extends keyof typeof PublicApi.Editable ? true : false
>;
export type FieldsetStyleHookRemoved = ExpectFalse<
  'useFieldsetStyles' extends keyof typeof PublicApi.Fieldset ? true : false
>;
export type FileUploadStyleHookRemoved = ExpectFalse<
  'useFileUploadStyles' extends keyof typeof PublicApi.FileUpload ? true : false
>;
export type ListboxStyleHookRemoved = ExpectFalse<
  'useListboxStyles' extends keyof typeof PublicApi.Listbox ? true : false
>;
export type MenuStyleHookRemoved = ExpectFalse<
  'useMenuStyles' extends keyof typeof PublicApi.Menu ? true : false
>;
export type PinInputStyleHookRemoved = ExpectFalse<
  'usePinInputStyles' extends keyof typeof PublicApi.PinInput ? true : false
>;
export type SelectStyleHookRemoved = ExpectFalse<
  'useSelectStyles' extends keyof typeof PublicApi.Select ? true : false
>;
export type TabsStyleHookRemoved = ExpectFalse<
  'useTabsStyles' extends keyof typeof PublicApi.Tabs ? true : false
>;
export type SwitchStyleHookRemoved = ExpectFalse<
  'useSwitchStyles' extends keyof typeof PublicApi.Switch ? true : false
>;
export type TagsInputStyleHookRemoved = ExpectFalse<
  'useTagsInputStyles' extends keyof typeof PublicApi.TagsInput ? true : false
>;
