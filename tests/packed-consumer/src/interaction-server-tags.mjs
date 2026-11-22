import assert from 'node:assert/strict';

/** Read an optional quoted attribute from one server-rendered opening tag. */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"(?=\\s|>)`))?.[1];
}

/** Find one opening tag by its native tag and a distinguishing attribute. */
export function requiredElement(markup, name, attributeName, value) {
  const openingTags = markup.match(/<[a-z][a-z0-9-]*\b[^>]*>/g) ?? [];
  const tag = openingTags.find(
    /** Match the native element and its exact attribute value. */
    (candidate) =>
      candidate.startsWith(`<${name} `) && attribute(candidate, attributeName) === value,
  );
  assert.ok(tag, `Packed server markup is missing ${name}[${attributeName}="${value}"].`);
  return tag;
}

/** Find the actual primitive part rather than any matching attribute in the tree. */
export function requiredPart(markup, scope, part) {
  const openingTags = markup.match(/<[a-z][a-z0-9-]*\b[^>]*>/g) ?? [];
  const tag = openingTags.find(
    /** Match the primitive's scoped part attribute, such as `data-tabs-trigger`. */
    (candidate) => attribute(candidate, `data-${scope}-${part}`) !== undefined,
  );
  assert.ok(tag, `Packed server markup is missing ${scope} ${part}.`);
  return tag;
}

/** Require a nonempty attribute on one selected native element or part. */
export function requiredAttribute(tag, name) {
  const value = attribute(tag, name);
  assert.ok(value, `Packed server ${tag.slice(0, 24)} is missing ${name}.`);
  return value;
}

/** Require a native boolean attribute on the selected opening tag. */
export function requiredBooleanAttribute(tag, name) {
  assert.match(tag, new RegExp(`\\s${name}(?=\\s|>)`));
}
