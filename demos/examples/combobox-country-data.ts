export const formCountries = [
  { country: 'United States', code: 'US', flag: '🇺🇸' },
  { country: 'Canada', code: 'CA', flag: '🇨🇦' },
  { country: 'Australia', code: 'AU', flag: '🇦🇺' },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { country: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { country: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { country: 'India', code: 'IN', flag: '🇮🇳' },
  { country: 'China', code: 'CN', flag: '🇨🇳' },
  { country: 'Japan', code: 'JP', flag: '🇯🇵' },
  { country: 'Korea', code: 'KR', flag: '🇰🇷' },
  { country: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { country: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { country: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { country: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { country: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { country: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { country: 'Hong Kong', code: 'HK', flag: '🇭🇰' },
  { country: 'Macau', code: 'MO', flag: '🇲🇴' },
  { country: 'Taiwan', code: 'TW', flag: '🇹🇼' },
];

export const objectCountries = formCountries.map(
  /** Match the different United Kingdom code in CustomObject. */
  (item) => (item.country === 'United Kingdom' ? { ...item, code: 'UK' } : item),
);
