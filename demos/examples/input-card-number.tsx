import { type JSX } from '@solidjs/web';
import { CreditCardIcon } from '@lucide/solid';
import { Input, InputGroup, usePaymentInputs } from '../../src';

/** Group a card number's digits as it is typed. */
export function InputCardNumber(): JSX.Element {
  const { wrapperProps, getCardNumberProps } = usePaymentInputs();
  return (
    <InputGroup {...wrapperProps} endElement={<CreditCardIcon />}>
      <Input {...getCardNumberProps()} />
    </InputGroup>
  );
}
