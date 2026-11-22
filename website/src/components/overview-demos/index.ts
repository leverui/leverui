import { type Component } from 'solid-js';
import { demos as core } from './core';
import { demos as absoluteCenterToBlockquote } from './absolute-center-to-blockquote';
import { demos as boxToClipboard } from './box-to-clipboard';
import { demos as closeButtonToDataList } from './close-button-to-data-list';
import { demos as dateInputToEnvironmentProvider } from './date-input-to-environment-provider';
import { demos as fieldToGrid } from './field-to-grid';
import { demos as groupToKbd } from './group-to-kbd';
import { demos as linkOverlayToNumberInput } from './link-overlay-to-number-input';
import { demos as overlayManagerToProse } from './overlay-manager-to-prose';
import { demos as qrCodeToSelect } from './qr-code-to-select';
import { demos as separatorToStack } from './separator-to-stack';
import { demos as statToToast } from './stat-to-toast';
import { demos as toggleTipToWrap } from './toggle-tip-to-wrap';

/** The small demo shown on each component's overview card, by guide slug. */
export const overviewDemos: Readonly<Record<string, Component>> = {
  ...core,
  ...absoluteCenterToBlockquote,
  ...boxToClipboard,
  ...closeButtonToDataList,
  ...dateInputToEnvironmentProvider,
  ...fieldToGrid,
  ...groupToKbd,
  ...linkOverlayToNumberInput,
  ...overlayManagerToProse,
  ...qrCodeToSelect,
  ...separatorToStack,
  ...statToToast,
  ...toggleTipToWrap,
};
