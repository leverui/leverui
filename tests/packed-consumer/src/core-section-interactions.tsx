import './action-bar.css';
import { type JSX } from '@solidjs/web';
import { PackedInteractions } from './interaction-example';
import { PackedCheckboxCard } from './checkbox-card-example';
import { PackedCombobox } from './combobox-example';
import { PackedAccordion } from './accordion-example';
import { PackedActionBar } from './action-bar-example';
import { PackedCollapsible } from './collapsible-example';

/** Render the packaged interactive controls on the main consumer page. */
export default function PackedCoreInteractions(): JSX.Element {
  return (
    <>
      <PackedInteractions />
      <PackedCheckboxCard />
      <PackedCombobox />
      <PackedAccordion />
      <PackedActionBar />
      <PackedCollapsible />
    </>
  );
}
