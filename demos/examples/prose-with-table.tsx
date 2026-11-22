import { type JSX } from '@solidjs/web';
import { Prose } from '../../src';

/** Show the prose example with semantic HTML. */
export function ProseWithTable(): JSX.Element {
  return (
    <Prose>
      <h3>Tables</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mara</td>
            <td>Maintainer</td>
            <td>maraellison</td>
          </tr>
          <tr>
            <td>Theo</td>
            <td>Design engineer</td>
            <td>theopark</td>
          </tr>
          <tr>
            <td>Iris</td>
            <td>Docs writer</td>
            <td>iriscalder</td>
          </tr>
          <tr>
            <td>Jonah</td>
            <td>Developer advocate</td>
            <td>jonahreyes</td>
          </tr>
        </tbody>
      </table>
    </Prose>
  );
}
