import { type JSX } from '@solidjs/web';
import { Prose } from '../../src';

/** Show the prose example with semantic HTML. */
export function ProseSink(): JSX.Element {
  return (
    <Prose style={{ 'margin-inline': 'auto' }}>
      <h1>Heading level 1</h1>
      <h2>Heading level 2</h2>
      <h3>Heading level 3</h3>
      <h4>Heading level 4</h4>

      <h4>
        Heading level 4 with <code>code</code>
      </h4>

      <p>
        Good notes are short and easy to find again. Write each note as if someone else will read
        it, because you will have forgotten the details by the time you open it again. Start with
        one line that says what the note is about, then add the details underneath. Keep one idea in
        each note, and link two notes together when one idea builds on the other. To reuse a line
        somewhere else, select it first. Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
      </p>

      <p>
        Go through your notes once a week. Delete the ones you no longer need, and merge the ones
        that say the same thing. A small set of notes you trust is more useful than a large pile you
        never open.
      </p>

      <hr />

      <p>
        Tags help when a note fits in more than one place. Use a few broad tags, such as work, home
        and reading, so you do not have to remember dozens of names later.
      </p>

      <h3>Blockquotes</h3>
      <blockquote>A short quote fits on one line.</blockquote>
      <p>A quote can also run over several lines:</p>
      <blockquote>
        Write each note as if someone else will read it. Start with one line that says what the note
        is about, then add the details underneath. If a note grows longer than one screen, split it
        into two.
      </blockquote>
      <p>
        Prose also styles <strong>strong</strong>, <b>b</b> and <em>em</em> text, and code blocks
        too.
      </p>
      <h3>Code</h3>
      <pre>
        <code>
          &lt;article&gt; &lt;h4&gt;Heading level 4&lt;/h4&gt; &lt;p&gt; Good notes are short and
          easy to find again. Write each note as if someone else will read it, because you will have
          forgotten the details by the time you open it again. Start with one line that says what
          the note is about, then add the details underneath. Keep one idea in each note, and link
          two notes together when one idea builds on the other. &lt;/p&gt; &lt;/article&gt;
        </code>
      </pre>
      <p>
        Inline code such as <code>console.log</code> works inside a sentence too.
      </p>
      <h3>Links</h3>
      <p>
        To learn more, <a href="https://leverui.com">read the docs</a>.
      </p>
      <h3>Figure</h3>
      <p>
        A picture can sit between two paragraphs. Give it a caption that says what it shows, so that
        readers who only skim the page still get the point.
      </p>
      <figure>
        <img alt="City skyline at night" src="/demo-images/scenes/city.webp" />
        <figcaption>City skyline at night</figcaption>
      </figure>
      <p>
        The text carries on below the figure with the same spacing as before. Keep a picture wide
        enough to see clearly, but no wider than the column of text around it.
      </p>
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
