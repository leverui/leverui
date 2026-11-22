/** Read a Select form value after confirming the locator found a native form. */
export function selectGuideFormValue(
  element: HTMLElement,
  name: string,
): FormDataEntryValue | null {
  if (!(element instanceof HTMLFormElement)) {
    throw new TypeError(`Expected a form when reading the ${name} Select value.`);
  }
  return new FormData(element).get(name);
}
