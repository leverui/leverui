import { verifyPackedField } from './packed-consumer-field.mjs';
import { verifyPackedNativeSelect } from './packed-consumer-native-select.mjs';
import { verifyPackedNumberInput } from './packed-consumer-number-input.mjs';
import { verifyPackedPinInput } from './packed-consumer-pin-input.mjs';
import { verifyPackedTextarea } from './packed-consumer-textarea.mjs';
import { verifyPackedFieldset } from './packed-consumer-fieldset.mjs';
import { verifyPackedFileUpload } from './packed-consumer-file-upload.mjs';
import { verifyPackedEditable } from './packed-consumer-editable.mjs';

/** Check installed field families in one focused browser sequence. */
export async function verifyPackedFields(page) {
  await verifyPackedField(page);
  await verifyPackedNativeSelect(page);
  await verifyPackedNumberInput(page);
  await verifyPackedPinInput(page);
  await verifyPackedTextarea(page);
  await verifyPackedFieldset(page);
  await verifyPackedFileUpload(page);
  await verifyPackedEditable(page);
}
