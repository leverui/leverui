import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

/** Keep the gallery in a consistent light appearance with Lever UI branding. */
const galleryTheme = create({
  base: 'light',
  brandTitle: 'Lever UI',
  brandUrl: '/',
  colorPrimary: '#111827',
  colorSecondary: '#2563eb',
});

addons.setConfig({ theme: galleryTheme });
