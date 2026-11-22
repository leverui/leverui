/** Read one native Slider form entry after validating the DOM boundary. */
export function sliderGuideFormValue(
  element: HTMLElement,
  name: string,
): FormDataEntryValue | null {
  if (!(element instanceof HTMLFormElement)) {
    throw new TypeError(`Expected a form when reading ${name}.`);
  }
  return new FormData(element).get(name);
}
