/** Reject server option rendering if it reaches a browser execution path. */
export function selectedServerOptions(): never {
  throw new Error('Native Select server options cannot render in a browser.');
}
