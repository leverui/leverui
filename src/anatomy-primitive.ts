import { comboboxAnatomy as primitiveComboboxAnatomy } from './primitives/components/combobox';

import { accordionAnatomy as primitiveAccordionAnatomy } from './primitives/components/accordion';

import { clipboardAnatomy as primitiveClipboardAnatomy } from './primitives/components/clipboard';

import { colorPickerAnatomy as primitiveColorPickerAnatomy } from './primitives/components/color-picker';

import { datePickerAnatomy as primitiveDatePickerAnatomy } from './primitives/components/date-picker';

import { dialogAnatomy as primitiveDialogAnatomy } from './primitives/components/dialog';

import { editableAnatomy as primitiveEditableAnatomy } from './primitives/components/editable';

import { fieldAnatomy as primitiveFieldAnatomy } from './primitives/components/field';

import { fieldsetAnatomy as primitiveFieldsetAnatomy } from './primitives/components/fieldset';

import { fileUploadAnatomy as primitiveFileUploadAnatomy } from './primitives/components/file-upload';

import { listboxAnatomy as primitiveListboxAnatomy } from './primitives/components/listbox';

import { menuAnatomy as primitiveMenuAnatomy } from './primitives/components/menu';

import { popoverAnatomy as primitivePopoverAnatomy } from './primitives/components/popover';

import { radioGroupAnatomy as primitiveRadioGroupAnatomy } from './primitives/components/radio-group';

import { ratingGroupAnatomy as primitiveRatingGroupAnatomy } from './primitives/components/rating-group';

import { selectAnatomy as primitiveSelectAnatomy } from './primitives/components/select';

import { sliderAnatomy as primitiveSliderAnatomy } from './primitives/components/slider';

import { splitterAnatomy as primitiveSplitterAnatomy } from './primitives/components/splitter';

import { switchAnatomy as primitiveSwitchAnatomy } from './primitives/components/switch';

export const accordionAnatomy = primitiveAccordionAnatomy.extendWith('itemBody');

export const datePickerAnatomy = primitiveDatePickerAnatomy.extendWith('indicatorGroup');

export const dialogAnatomy = primitiveDialogAnatomy.extendWith(
  'header',
  'body',
  'footer',
  'backdrop',
);

export const drawerAnatomy = primitiveDialogAnatomy.extendWith(
  'header',
  'body',
  'footer',
  'backdrop',
);

export const editableAnatomy = primitiveEditableAnatomy.extendWith('textarea');

export const fieldAnatomy = primitiveFieldAnatomy.extendWith('requiredIndicator');

export const fieldsetAnatomy = primitiveFieldsetAnatomy.extendWith('content');

export const fileUploadAnatomy = primitiveFileUploadAnatomy.extendWith(
  'itemContent',
  'dropzoneContent',
  'fileText',
);

export const menuAnatomy = primitiveMenuAnatomy.extendWith('itemCommand');

export const popoverAnatomy = primitivePopoverAnatomy.extendWith('header', 'body', 'footer');

export const radioGroupAnatomy = primitiveRadioGroupAnatomy.extendWith(
  'itemAddon',
  'itemIndicator',
);

export const radioCardAnatomy = radioGroupAnatomy.extendWith('itemContent', 'itemDescription');

export const ratingGroupAnatomy = primitiveRatingGroupAnatomy.extendWith('itemIndicator');

export const selectAnatomy = primitiveSelectAnatomy.extendWith('indicatorGroup');

export const comboboxAnatomy = primitiveComboboxAnatomy.extendWith('indicatorGroup', 'empty');

export const sliderAnatomy = primitiveSliderAnatomy.extendWith('markerIndicator', 'markerLabel');

export const switchAnatomy = primitiveSwitchAnatomy.extendWith('indicator');

export const colorPickerAnatomy = primitiveColorPickerAnatomy.extendWith('channelText');

export { treeViewAnatomy } from './primitives/components/tree-view';

export { dateInputAnatomy } from './primitives/components/date-input';

export { avatarAnatomy } from './primitives/components/avatar';

export { checkboxAnatomy } from './primitives/components/checkbox';

export { collapsibleAnatomy } from './primitives/components/collapsible';

export { hoverCardAnatomy } from './primitives/components/hover-card';

export { numberInputAnatomy } from './primitives/components/number-input';

export { pinInputAnatomy } from './primitives/components/pin-input';

export { progressAnatomy } from './primitives/components/progress';

export { qrCodeAnatomy } from './primitives/components/qr-code';

export { scrollAreaAnatomy } from './primitives/components/scroll-area';

export { segmentGroupAnatomy } from './primitives/components/segment-group';

export { tooltipAnatomy } from './primitives/components/tooltip';

export { tagsInputAnatomy } from './primitives/components/tags-input';

export const splitterAnatomy = primitiveSplitterAnatomy.extendWith(
  'resizeTriggerSeparator',
  'resizeTriggerIndicator',
);

export { carouselAnatomy } from './primitives/components/carousel';

export const clipboardAnatomy = primitiveClipboardAnatomy.extendWith('valueText');

export const listboxAnatomy = primitiveListboxAnatomy;

export { marqueeAnatomy } from './primitives/components/marquee';
export { paginationAnatomy } from './primitives/components/pagination';

export { floatingPanelAnatomy } from './primitives/components/floating-panel';
