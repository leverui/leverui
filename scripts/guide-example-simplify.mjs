/**
 * Reduce example source to what a reader copies into an app. Repository code keeps JSDoc and
 * explicit return types for review; displayed examples drop them, matching the docs.
 */

const packageStylesheetLine = /^import '@leverui\/components\/styles\.css';\n/m;

/** Remove JSDoc comments, including JSX comment containers that would otherwise be left empty. */
function withoutDocComments(source) {
  return source
    .replace(/\{\s*\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*\}[ \t]*\n?/g, '')
    .replace(/[ \t]*\/\*\*[\s\S]*?\*\/[ \t]*\n?/g, '');
}

/** Remove `JSX.Element` and `void` return annotations that inference already provides. */
function withoutReturnTypes(source) {
  return source.replace(/\)\s*:\s*(?:JSX\.Element|void)\s*(?=\{|=>)/g, ') ');
}

/** Drop the `JSX` type import when no remaining code refers to it. */
function withoutUnusedJsxImport(source) {
  const body = source.replace(/^import [^;]*;$/gm, '');
  if (/\bJSX\b/.test(body)) return source;
  return source
    .replace(/^import (?:type )?\{\s*(?:type )?JSX\s*\} from '(?:solid-js|@solidjs\/web)';\n/m, '')
    .replace(/^(import \{[^}]*?)\btype JSX,\s*/m, '$1')
    .replace(/^(import \{[^}]*?),\s*type JSX\b/m, '$1');
}

/**
 * Drop the gallery's patterned placeholder surface. Its stylesheet only exists in this
 * repository, so the displayed code renders a plain `Box`, as the docs show their
 * `DecorativeBox` placeholders.
 */
function withoutDecorativeSurface(source) {
  return source.replace(
    /\s+(?:class="example-decorative-box"|data-decorative-[\w-]+="[^"]*")/g,
    '',
  );
}

/** Simplify one example's declarations; imports are handled separately. */
export function simplifiedDeclarations(source) {
  return withoutDecorativeSurface(withoutReturnTypes(withoutDocComments(source)));
}

/**
 * Simplify a complete example module. The package stylesheet is imported once by the app
 * entry, as the installation guide shows, so examples do not repeat it.
 */
export function simplifiedModule(source) {
  return withoutUnusedJsxImport(simplifiedDeclarations(source.replace(packageStylesheetLine, '')));
}
