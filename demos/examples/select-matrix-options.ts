/** The options for the Select size, variant, color, and positioning examples. */
import { Select } from '../../src';

export const fruits = Select.createListCollection({
  items: [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Grape', value: 'grape' },
  ],
});

export const themes = Select.createListCollection({
  items: [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
    { label: 'High contrast', value: 'high-contrast' },
  ],
});

export const statuses = Select.createListCollection({
  items: [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ],
});

export const times = Select.createListCollection({
  items: [
    { label: '9:00 AM', value: '9-00-am' },
    { label: '12:00 PM', value: '12-00-pm' },
    { label: '3:00 PM', value: '3-00-pm' },
    { label: '6:00 PM', value: '6-00-pm' },
  ],
});
