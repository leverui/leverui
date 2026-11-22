import './icon.css';
import { type Component } from 'solid-js';
import { mountPackedPage } from './mount-packed-page';
import { PackedSections } from './packed-sections';

const sections = import.meta.glob<{ default: Component }>('./presentation-section-*.tsx', {
  eager: true,
});

mountPackedPage(
  /** Mount every typed presentation section in the installed consumer. */
  () => <PackedSections modules={sections} />,
);
