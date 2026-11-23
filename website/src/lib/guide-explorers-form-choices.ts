import type { GuideExplorerConfig } from './guide-explorers';
import { lazyExport } from './lazy-export';

/** Explorers for the choice and range form-control guides. */
export const formChoiceGuideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  checkbox: {
    name: 'Checkbox',
    parts: ['root', 'label', 'control', 'indicator', 'group'],
    selectors: { root: '.lui-checkbox', group: '.lui-checkbox-group' },
    Demo: lazyExport(
      /** Load the maintained preview only on the Checkbox guide. */
      () => import('../../../demos/examples/checkbox-standard'),
      'CheckboxExplorerDemo',
    ),
  },
  'checkbox-card': {
    name: 'Checkbox Card',
    parts: ['root', 'control', 'label', 'description', 'addon', 'indicator', 'content'],
    selectors: {
      root: '.lui-checkbox-card',
      indicator: '[data-part="indicator"]',
    },
    Demo: lazyExport(
      /** Load the maintained preview only on the Checkbox Card guide. */
      () => import('../../../demos/examples/checkbox-card-standard'),
      'CheckboxCardExplorerDemo',
    ),
  },
  'color-picker': {
    name: 'Color Picker',
    parts: [
      'root',
      'label',
      'control',
      'trigger',
      'positioner',
      'content',
      'area',
      'areaThumb',
      'valueText',
      'areaBackground',
      'channelSlider',
      'channelSliderLabel',
      'channelSliderTrack',
      'channelSliderThumb',
      'channelSliderValueText',
      'channelInput',
      'transparencyGrid',
      'swatchGroup',
      'swatchTrigger',
      'swatchIndicator',
      'swatch',
      'eyeDropperTrigger',
      'formatTrigger',
      'formatSelect',
    ],
    selectors: {
      eyeDropperTrigger: '[data-part="eye-dropper-trigger"]',
    },
    Demo: lazyExport(
      /** Load the maintained preview only on the Color Picker guide. */
      () => import('../../../demos/examples/color-picker-explorer-demo'),
      'ColorPickerExplorerDemo',
    ),
  },
  'radio-card': {
    name: 'Radio Card',
    parts: ['root', 'label', 'item', 'itemText', 'itemControl', 'itemAddon', 'itemIndicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Radio Card guide. */
      () => import('../../../demos/examples/radio-card-composition'),
      'RadioCardExplorerDemo',
    ),
  },
  slider: {
    name: 'Slider',
    parts: [
      'root',
      'label',
      'thumb',
      'valueText',
      'track',
      'range',
      'control',
      'markerGroup',
      'marker',
      'draggingIndicator',
      'markerIndicator',
      'markerLabel',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Slider guide. */
      () => import('../../../demos/examples/slider-explorer-demo'),
      'SliderExplorerDemo',
    ),
  },
  switch: {
    name: 'Switch',
    parts: ['root', 'label', 'control', 'thumb', 'indicator'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Switch guide. */
      () => import('../../../demos/examples/switch-standard'),
      'SwitchExplorerDemo',
    ),
  },
};
