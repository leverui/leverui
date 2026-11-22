import { type JSX } from '@solidjs/web';
import { Prose } from '../../src';

/** Show the prose example with semantic HTML. */
export function ProseWithList(): JSX.Element {
  return (
    <Prose>
      <h3>Lists</h3>
      <p>Here is an unordered list. Things to buy:</p>
      <ul>
        <li>Milk</li>
        <li>Eggs</li>
        <li>Bread</li>
        <li>Coffee</li>
      </ul>
      <p>And here is an ordered list. Things to do:</p>
      <ol>
        <li>Pay the bills</li>
        <li>Walk the dog</li>
        <li>Take out the trash</li>
      </ol>
    </Prose>
  );
}
