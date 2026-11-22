/** Wait until deferred Tags Input clear and focus actions have run. */
export async function settleTagFrame(): Promise<void> {
  await new Promise<void>(
    /** Queue the completion after machine actions scheduled this frame. */
    (resolve) => {
      /** Finish the Playwright browser callback on the next animation frame. */
      function completeFrame(): void {
        resolve();
      }

      requestAnimationFrame(completeFrame);
    },
  );
}
