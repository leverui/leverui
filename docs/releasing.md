# Releasing

How to publish `@leverui/components` to npm. This guide is for maintainers and
is not included in the package.

## How releases work

There is one long-lived branch, `main`. Every release is published from `main`.

- New work happens on a short-lived branch and is merged into `main` through a
  pull request.
- Merging into `main` does not publish anything. A release is a separate step
  you take when `main` is ready to ship.
- There is no release branch. A prerelease is told apart by its version number
  and npm tag, not by a branch.

## Versions and npm tags

Version numbers never contain the words alpha or beta. Every prerelease of an
upcoming major version is numbered `-next.N` and published under the `next`
tag. Alpha and beta describe how finished a prerelease is. Say which one it is
in the changelog and on the website, not in the version.

| Release              | Version example             | npm tag     | Users install with              |
| -------------------- | --------------------------- | ----------- | ------------------------------- |
| Prerelease           | `1.0.0-next.0`              | `next`      | `@leverui/components@next`      |
| Stable               | `1.0.0`                     | `latest`    | `@leverui/components`           |
| Fix for an old major | `1.4.2`, once `2.0.0` ships | `v1-latest` | `@leverui/components@v1-latest` |
| Snapshot for testing | `0.0.0-dev-20261119120000`  | `dev`       | `@leverui/components@dev`       |

- Each new prerelease raises the last number: `1.0.0-next.0`, then
  `1.0.0-next.1`, and so on. The first stable release drops the suffix:
  `1.0.0`.
- Work on the next major starts again at `2.0.0-next.0`, while `1.x` fixes keep
  going out under `latest` until `2.0.0` ships.
- A snapshot is a throwaway build of one commit. Its version is `0.0.0-dev-`
  followed by the build time, so it never sorts above a real release.

The `publishConfig.tag` field in `package.json` holds the tag for the version
in `package.json`: `next` for a prerelease, `latest` for a stable release.
Change it when the kind of release changes.

## Before the first release

- Sign in with `npm login`, using an account that belongs to the `leverui` npm
  organization. Scoped packages publish only to an organization you belong
  to.
- Turn on two-factor authentication for the account. npm asks for a one-time
  code during `npm publish`.
- Push the repository to GitHub at the address in `package.json`
  (`github.com/leverui/leverui`), so the package's repository link works.

## Release steps

### 1. Merge into `main`

Merge the finished work into `main` and check out an up-to-date, clean copy of
it.

### 2. Set the version and changelog

Update the version in `package.json`, for example from `1.0.0-next.0` to
`1.0.0-next.1`. Add a `CHANGELOG.md` entry with that version at the top,
listing what was added, changed, and fixed. Commit both to `main`.

### 3. Check the release

Run these from the release commit:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test:packed-consumer
pnpm test:release-bundles
```

`pnpm build` also runs `verify:package`, which fails if the archive contains a
file outside `dist`, the license files, the README, or the changelog. The
build copies the user guides into `dist/docs` with an `llms.txt` index, so
the package carries the docs for its own version. The maintainer guides, such
as this one, stay out.
To see exactly what will ship, run:

```sh
npm pack --dry-run
```

### 4. Publish

Publish under the tag that matches the version:

```sh
npm publish --tag next
```

Always pass `--tag` for prerelease versions. Without it, npm 11 publishes
under `latest`, and the prerelease becomes what a plain
`npm install @leverui/components` installs. The `prepack` script rebuilds the
package before it is uploaded.

Confirm the release and its tags:

```sh
npm view @leverui/components dist-tags
```

### 5. Tag the commit

Tag the release commit with its version and push the tag:

```sh
git tag v1.0.0-next.1
git push origin v1.0.0-next.1
```

## Later: automated releases

Once the repository is on GitHub, releases can be automated with
[Changesets](https://github.com/changesets/changesets):

1. Each pull request adds a short note describing its change and whether it is
   a patch, minor, or major change.
2. When pull requests merge into `main`, a bot opens one "Version Packages" pull
   request that raises the version and writes the changelog from those notes.
3. Merging that pull request publishes to npm.
4. For prereleases, Changesets' prerelease mode (`changeset pre enter next`)
   makes the same steps produce `-next.N` versions under the `next` tag.
   `changeset pre exit` returns to stable releases.

Until then, follow the manual steps above.
