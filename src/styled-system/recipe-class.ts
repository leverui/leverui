import { classValueTokens, type ClassValue } from '../utils/class-value';

/** Return the stable public class hook for a Lever UI recipe. */
export function recipeClassName(name: string): string {
  return `leverui-${name}`;
}

/** Split a class string, array, or toggle object into nonempty class tokens. */
function classTokens(value: ClassValue): string[] {
  return classValueTokens(value);
}

/** Combine stable, configured, and consumer hooks without repeating a class. */
export function composeRecipeClassNames(
  name: string,
  configuredClassName: ClassValue,
  ...consumerClassNames: ClassValue[]
): string {
  const names = [recipeClassName(name), configuredClassName, ...consumerClassNames];
  return [...new Set(names.flatMap(classTokens))].join(' ');
}
