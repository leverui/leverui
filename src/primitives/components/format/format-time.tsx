import { formatTime, type FormatTimeOptions } from '@zag-js/i18n-utils';
import { createMemo } from 'solid-js';
import { useLocaleContext } from '../../providers/index';

export interface FormatTimeProps extends FormatTimeOptions {
  /**
   * The time to format
   */
  value: string | Date;
}

/** Render the Format time. */
export const FormatTime = (props: FormatTimeProps) => {
  const ctx = useLocaleContext();
  const text = createMemo(() => {
    const { value, ...intlOptions } = props;
    return formatTime(value, ctx().locale, intlOptions);
  });
  return <>{text()}</>;
};
