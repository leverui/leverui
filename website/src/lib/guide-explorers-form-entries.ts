import type { GuideExplorerConfig } from './guide-explorers';
import { lazyExport } from './lazy-export';

/** Explorers for the text, file, field, and date form-control guides. */
export const formEntryGuideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  'date-picker': {
    name: 'Date Picker',
    parts: [
      'clearTrigger',
      'content',
      'control',
      'input',
      'label',
      'monthSelect',
      'nextTrigger',
      'positioner',
      'presetTrigger',
      'prevTrigger',
      'rangeText',
      'root',
      'table',
      'tableBody',
      'tableCell',
      'tableCellTrigger',
      'tableHead',
      'tableHeader',
      'tableRow',
      'trigger',
      'view',
      'viewControl',
      'viewTrigger',
      'yearSelect',
      'valueText',
      'indicatorGroup',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Date Picker guide. */
      () => import('../../../demos/examples/date-picker-explorer-demo'),
      'DatePickerExplorerDemo',
    ),
  },
  editable: {
    name: 'Editable',
    parts: [
      'root',
      'area',
      'label',
      'preview',
      'input',
      'editTrigger',
      'submitTrigger',
      'cancelTrigger',
      'control',
      'textarea',
    ],
    selectors: { input: 'input.leverui-editable__input' },
    Demo: lazyExport(
      /** Load the maintained preview only on the Editable guide. */
      () => import('../../../demos/examples/editable-explorer-demo'),
      'EditableExplorerDemo',
    ),
  },
  field: {
    name: 'Field',
    parts: [
      'root',
      'errorText',
      'helperText',
      'input',
      'label',
      'select',
      'textarea',
      'requiredIndicator',
    ],
    selectors: {
      input: '.leverui-input',
      select: '.leverui-native-select__field',
      textarea: '.leverui-textarea',
    },
    Demo: lazyExport(
      /** Load the maintained preview only on the Field guide. */
      () => import('../../../demos/examples/field-explorer-demo'),
      'FieldExplorerDemo',
    ),
  },
  fieldset: {
    name: 'Fieldset',
    parts: ['root', 'errorText', 'helperText', 'legend', 'content'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Fieldset guide. */
      () => import('../../../demos/examples/fieldset-form'),
      'FieldsetExplorerDemo',
    ),
  },
  'file-upload': {
    name: 'File Upload',
    parts: [
      'root',
      'dropzone',
      'item',
      'itemDeleteTrigger',
      'itemGroup',
      'itemName',
      'itemPreview',
      'itemPreviewImage',
      'itemSizeText',
      'label',
      'trigger',
      'clearTrigger',
      'itemContent',
      'dropzoneContent',
      'fileText',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the File Upload guide. */
      () => import('../../../demos/examples/file-upload-explorer-demo'),
      'FileUploadExplorerDemo',
    ),
  },
  'native-select': {
    name: 'Native Select',
    parts: ['root', 'field', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Native Select guide. */
      () => import('../../../demos/examples/native-select-standard'),
      'NativeSelectBasic',
    ),
  },
  'number-input': {
    name: 'NumberInput',
    parts: [
      'root',
      'label',
      'input',
      'control',
      'valueText',
      'incrementTrigger',
      'decrementTrigger',
      'scrubber',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Number Input guide. */
      () => import('../../../demos/examples/number-input-explorer-demo'),
      'NumberInputExplorerDemo',
    ),
  },
  'pin-input': {
    name: 'Pin Input',
    parts: ['root', 'label', 'input', 'control'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Pin Input guide. */
      () => import('../../../demos/examples/pin-input-standard'),
      'PinInputExplorerDemo',
    ),
  },
  'tags-input': {
    name: 'TagsInput',
    parts: [
      'root',
      'label',
      'control',
      'input',
      'clearTrigger',
      'item',
      'itemPreview',
      'itemInput',
      'itemText',
      'itemDeleteTrigger',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Tags Input guide. */
      () => import('../../../demos/examples/tags-input-basic'),
      'TagsInputExplorer',
    ),
  },
};
