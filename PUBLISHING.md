# Publishing to npm

This package is published publicly as
`@wvanderp/wikibase-datamodel-types`. It is a declaration-only package: the
published artifact contains `dist/index.d.ts`, not runtime JavaScript.

## Authentication model

Use npm trusted publishing for routine releases. It lets the GitHub Actions
workflow authenticate with a short-lived OpenID Connect (OIDC) credential, so
the repository does not need an `NPM_TOKEN` secret.

npm requires one of the following for a direct publish:

- an account with two-factor authentication (2FA), for an interactive publish;
- a granular access token with read/write package permission and **Bypass 2FA**
  enabled, for non-interactive token-based publishing; or
- a configured trusted publisher, for supported CI/CD systems.

Only granular access tokens are supported. Prefer OIDC over storing a write
token. Never commit an npm token or put it in a checked-in `.npmrc` file.

Trusted publishing requires npm 11.5.1 or newer and Node.js 22.14.0 or newer.
The repository's publish workflow uses Node.js 24 and has the required
`id-token: write` permission.

Official references:

- [Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)
- [Publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)
- [npm publishing and 2FA](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)
- [Creating granular access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens/)

## Configure trusted publishing

On npmjs.com, open the package, then **Settings → Trusted Publisher**. Add a
GitHub Actions publisher with these exact values:

| Setting | Value |
| --- | --- |
| Organization or user | `wvanderp` |
| Repository | `WikibaseDataModelTypes` |
| Workflow filename | `publish.yml` |
| Environment | leave blank |
| Allowed action | allow direct `npm publish` |

Enter only `publish.yml`, not `.github/workflows/publish.yml`. npm does not
validate these values when they are saved, and matching is exact. The
`repository.url` in `package.json` must also continue to point to this GitHub
repository.

After one OIDC release succeeds, set the package's publishing access to
**Require two-factor authentication and disallow tokens**. Revoke any granular
write token that was created for publishing. The current workflow does not use
an `NPM_TOKEN` GitHub secret.

## Routine release checklist

1. Pull the latest `master` and make sure CI is green.
2. Choose the next semantic version and update it, for example:

   ```sh
   npm version patch --no-git-tag-version
   pnpm install --lockfile-only
   ```

3. Run the release checks and inspect the artifact:

   ```sh
   pnpm test
   pnpm build
   npm pack --dry-run
   git diff --check
   git status --short
   ```

4. Commit the version change and push it. Create and publish a GitHub release
   whose tag points to that exact commit. A tag such as `v0.2.1` should match
   version `0.2.1` in `package.json`.
5. Publishing the GitHub release triggers `.github/workflows/publish.yml`.
   Check that the workflow succeeds, then verify the registry:

   ```sh
   npm view @wvanderp/wikibase-datamodel-types version
   ```

The workflow can also be started manually with `workflow_dispatch`. Use that
only to retry a failed release from a commit whose `package.json` version has
not already been published. npm versions are immutable: an existing version
cannot be overwritten.

## Token fallback

If trusted publishing is temporarily unavailable, create a granular token on
npmjs.com with read/write access limited to this package, the shortest practical
expiry, and **Bypass 2FA** enabled. Store it as a GitHub Actions secret named
`NPM_TOKEN`, and temporarily pass it to the publish step as `NODE_AUTH_TOKEN`:

```yaml
- name: Publish
  run: npm publish --access public
  env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Remove the workflow mapping and revoke the token immediately after migrating
back to trusted publishing. A token without Bypass 2FA cannot complete a
non-interactive direct publish when npm requires a second factor.
