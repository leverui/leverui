# Lever UI website

The public website is a static Solid 2 site in `website/`, built with Vite and
a prerender script. It uses Lever UI itself for its interactive component
examples and reads the maintained Markdown guides in this repository.

## Goals

Visitors should be able to learn what the library offers, try components,
browse the component overview, read a guide, copy an example, understand theming, and
find the source repository. Keep the site's content true to the current
Lever UI package and to SolidJS.

| Area             | Current state                                                                                                                                          | Remaining work                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Homepage         | Compact hero, horizontal five-component demo rail, design-system explanation, and feature sections                                                     | Refine lower sections and responsive visual comparison         |
| Navigation       | Sticky header with the four docs sections as pills, shared docs sidebar, mobile menu, site-wide search, and theme switch                               | Tune search ranking and mobile docs navigation                 |
| Docs entry       | `/docs` redirects to the Getting started guide; the Components overview shows every component as a card with a small live demo                         | Keep each demo current as components change                    |
| Component guides | Static three-column pages; 144 guides show live Solid demos, most with source and Preview/Code panels                                                  | Make excerpts standalone, then add anatomy and property tables |
| System guides    | Seven statically generated guides covering setup, theming, accessibility, and rendering                                                                | Add task-oriented examples and syntax highlighting             |
| Playground       | Page for editing public color and radius tokens, with a live Lever UI preview and CSS export                                                           | Add more public tokens and compare light/dark appearances      |
| Theme reference  | Generated CSS variable index and category pages, linked from the documentation; a Colors page shows every palette as swatches that copy their variable | Add token search and swatches for color values                 |
| Publishing       | Static files in `website/dist/client/`, deployed to the Cloudflare Pages project `leverui`                                                             | Point `leverui.com` at the project and add deployment checks   |

The site makes no sponsor, testimonial, or adoption claims. Add those areas
only with real project information once it exists.

## Content and naming

`docs/components/*.md` and selected root `docs/*.md` are the source of truth
for guide content. Edit a guide there and rebuild the site. Site copy uses
`Lever UI`; package names, paths, and CSS hooks follow `docs/naming.md`.

Visual component pages load the maintained Solid Storybook stories on demand.
The Storybook story is
the source of the interactive preview on both surfaces. Code panels use an
authored copyable snippet when the story provides one; otherwise
`scripts/generate-guide-example-source.mjs` builds a standalone module from the
story's example and every helper it uses. The Button
page also keeps custom previews. Fifteen pages cover hooks, utilities, or
broader concepts and remain code-focused. The static build prerenders written
guidance and every example, so the examples are already in the page when it
loads. Each demo family is one generated module in
`website/src/generated/guide-families/`, written by
`scripts/guide-family-module.mjs` and loaded as a `lazy` component: the
prerender waits for it, the browser preloads it before hydration, and switching
guides keeps the old page until the new family is ready. An example must
therefore render without the browser: touch `window` or `document` only inside
`onSettled`, and return the cleanup from it.

A guide's opening paragraph is shown under its title as the lead. A guide may
open with code, a heading, a list or a table instead, as the charts pages do;
it then has no lead.

A story's `after` copy renders below its example. When that copy is only
Markdown quotes, the site treats it as a note and renders it above the example,
under the description.

The Components overview is its own route, so its demos load with that page
only. It has one card for each guide in the Components sidebar; the charts,
which have their own tab, are not on it. Each card's demo lives in
`website/src/components/overview-demos/`, is marked `inert`, and sits in its
own error boundary. A popup component gets a static picture of its open state;
a component with no appearance gets an icon.

Each example shows its TSX only. The demo stylesheets that set layout in
Storybook are not shown, and the displayed code does not import them. Keep
adjacent usage code fences together before the example gallery when a guide
needs more than one file.
All website code blocks use the `dark-plus` syntax colors on a dark
background in both site themes. The static build prerenders the colored
tokens, so written snippets remain highlighted before hydration.
Example tabs use a 16px code line with 24px padding; Markdown fences use a
14.4px line with 28.8px padding. Syntax tokens render at 13.12px in both.

Storybook is a development gallery in this repository, not a separately hosted
public site. In a checkout, run `pnpm storybook` and open
`http://127.0.0.1:6006/`. The website therefore explains the shared examples
without sending visitors to a localhost link.

The package is in alpha, and installation copy uses the `next` npm tag.
Review release status before deploying the site so the call to action matches
what visitors can actually install.

The site imports Lever UI's authored stylesheet in `website/src/app.tsx`.

## Brand and color mode

The site uses the supplied Lever UI wordmark and symbol from `website/public/`.
The color wordmark appears on light surfaces; a light-lettering variant keeps
the same symbol legible on dark surfaces. The symbol is also the favicon and
hero artwork. Website accents and component examples use the logo's blue
palette, with site tokens and public blue component-token overrides defined in
`website/src/styles/site-theme-tokens.css`.

The header switch sets `data-leverui-color-mode` on the root element, so the
website and Lever UI components change together. A visitor's choice is saved
under `leverui-site-color-mode`. Before hydration, the entry script applies
that choice, or the system preference when there is no saved choice. The
light and dark modes must both work on prerendered pages without a server.

Website interface icons use the official `bootstrap-icons` package through
its bundled icon font. `SiteIcon` renders decorative icons with accessible
names supplied by the surrounding control or link. The supplied Lever UI
wordmark and symbol remain brand assets, not interface icons.

The library stylesheet has no page-wide rules. Storybook and the site import
`demos/page-styles/index.css` after it, which adds a page reset and the `html`
text color, background, and line height for the demo pages only.

The examples use `@lucide/solid` components, plus fictional brand marks in
`demos/examples/brand-logos.tsx`. Demo photos and avatars are served from
`website/public/demo-images/`, which Storybook also serves as a static
directory. The photos in `scenes/`, and `avatar-5` and `avatar-6` in `avatars/`,
come from Unsplash and are used under the
[Unsplash License](https://unsplash.com/license), not this project's MIT
license. The illustrated portraits `avatar-1` to `avatar-4` were supplied by
the project owner. They are not part of the npm package. The rule in
`demos/example-icons.css`, loaded by Storybook and the site, sizes Lucide
icons to the surrounding text. The Vite plugin in
`demos/lucide-icon-imports.ts`, used by Storybook and the site, loads each
Lucide icon from its own module. Without it, the dev server compiles all of
Lucide's icon modules for every page. The Code tabs keep the usual
`import { … } from '@lucide/solid'` form.

## Publishing

Build the site, then upload `website/dist/client/` to the Cloudflare Pages
project `leverui`:

```bash
pnpm --dir website build
pnpm dlx wrangler pages deploy website/dist/client --project-name leverui --branch main
```

The host serves `website/public/404.html` for any address with no file, with a
404 status. That page loads no app script, because each prerendered page
hydrates against the address it was built for.

## Verification

Run the website typecheck, targeted ESLint, and static build. Inspect the
homepage and a representative guide at desktop and mobile widths; verify menu,
component interactions, internal links, and direct reloads of
prerendered routes. Check that the generated pages contain real content without
a running server.
