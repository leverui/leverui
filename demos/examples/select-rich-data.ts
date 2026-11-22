import { Select } from '../../src';

export const memberItems = [
  {
    name: 'Mara Ellison',
    id: 'mara_ellison',
    avatar: '/demo-images/avatars/avatar-1.webp',
  },
  {
    name: 'Jonah Reyes',
    id: 'jonah_reyes',
    avatar: '/demo-images/avatars/avatar-4.webp',
  },
  {
    name: 'Iris Calder',
    id: 'iris_calder',
    avatar: '/demo-images/avatars/avatar-3.webp',
  },
] as const;

export const members = Select.createListCollection({
  items: memberItems,
  itemToString:
    /** Show a person's readable name in the selected value. */
    (item) => item.name,
  itemToValue:
    /** Keep a stable ID in the native form field. */
    (item) => item.id,
});

export const countryItems = [
  { value: 'US', label: 'United States', flag: '🇺🇸', continent: 'America' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦', continent: 'America' },
  { value: 'MX', label: 'Mexico', flag: '🇲🇽', continent: 'America' },
  { value: 'BR', label: 'Brazil', flag: '🇧🇷', continent: 'America' },
  { value: 'ZA', label: 'South Africa', flag: '🇿🇦', continent: 'Africa' },
  { value: 'NG', label: 'Nigeria', flag: '🇳🇬', continent: 'Africa' },
  { value: 'MA', label: 'Morocco', flag: '🇲🇦', continent: 'Africa' },
  { value: 'EG', label: 'Egypt', flag: '🇪🇬', continent: 'Africa' },
  { value: 'CN', label: 'China', flag: '🇨🇳', continent: 'Asia' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵', continent: 'Asia' },
  { value: 'IN', label: 'India', flag: '🇮🇳', continent: 'Asia' },
  { value: 'KR', label: 'South Korea', flag: '🇰🇷', continent: 'Asia' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
  { value: 'FR', label: 'France', flag: '🇫🇷', continent: 'Europe' },
  { value: 'DE', label: 'Germany', flag: '🇩🇪', continent: 'Europe' },
  { value: 'IT', label: 'Italy', flag: '🇮🇹', continent: 'Europe' },
  { value: 'ES', label: 'Spain', flag: '🇪🇸', continent: 'Europe' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
  { value: 'NZ', label: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' },
  { value: 'FJ', label: 'Fiji', flag: '🇫🇯', continent: 'Oceania' },
] as const;

export const countries = Select.createListCollection({
  items: countryItems,
  itemToString:
    /** Place the flag before the country's name in the selected value. */
    (item) => `${item.flag} ${item.label}`,
  itemToValue:
    /** Submit the ISO country code. */
    (item) => item.value,
});

export const planItems = [
  { label: 'Basic plan', value: 'basic', description: '$8/month - For small projects' },
  { label: 'Pro plan', value: 'pro', description: '$24/month - For growing teams' },
  {
    label: 'Business plan',
    value: 'business',
    description: '$79/month - For larger companies',
  },
  {
    label: 'Enterprise plan',
    value: 'enterprise',
    description: 'Custom pricing - Talk to our sales team',
  },
] as const;
export const plans = Select.createListCollection({ items: planItems });

export const mediaItems = [
  { label: 'Lanternwright', value: 'lanternwright', category: 'Books' },
  { label: 'Saltwind', value: 'saltwind', category: 'Books' },
  { label: 'The Glass Orchard', value: 'the-glass-orchard', category: 'Books' },
  { label: 'The Quiet Harbor', value: 'the-quiet-harbor', category: 'Movies' },
  { label: 'Midnight Ferry', value: 'midnight-ferry', category: 'Movies' },
  { label: 'The Last Lighthouse', value: 'the-last-lighthouse', category: 'Movies' },
] as const;
export const media = Select.createListCollection({ items: mediaItems });
