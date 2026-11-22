# Lever UI Solid starter

This app imports only public `@leverui/components` exports. It demonstrates the
provider, a scoped CSS theme, an accessible field, and a reactive button.

From the Lever UI repository root, create the package archive:

```sh
pnpm pack --pack-destination examples/solid-starter
```

Then install and run the example:

```sh
cd examples/solid-starter
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

From the repository root, `node scripts/verify-solid-starter.mjs` runs the
Chromium smoke check after the app build.

The archive and local lockfile are ignored by Git. Repack and run
`pnpm install` after changing the library.
This starter uses the local archive to verify the exact package before
publication and after changes. To try the published alpha in your own app,
install `@leverui/components@next` with `solid-js` and `@solidjs/web` from npm.
Lever UI runs on Solid 2.
